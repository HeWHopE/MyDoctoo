import { BadRequestException, Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseUserDto } from '../user/dto/response.dto';
import { UserDec } from '../user/user.decorator';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { UnauthorizedResponse } from '../utils/UnauthorizedResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { GoogleSignInResponseDto } from './dto/googleSignInResponse.dto';
import { LocalLoginDto } from './dto/localLogin.dto';
import { LocalLoginResponseDto } from './dto/localLoginResponse.dto';
import { LocalLoginTwoFactorDto } from './dto/localLoginTwoFactor.dto';
import { SignUpPatientDto } from './dto/signUpPatient.dto';
import { SignUpUserDto } from './dto/signUpUser.dto';
import JWTGuard from './gaurds/jwt.guard';
import { GoogleAuthGuard } from './strategies/google';
import { AuthRequestHelper } from './utils/cookie-helper.service';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { MeResponseDto } from './dto/getMe.dto';

@ApiTags('Auth Endpoints')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly requestHelper: AuthRequestHelper,
    private readonly authService: AuthService,
  ) {}

  @Post('login/patient')
  @ApiOperation({ summary: 'Login patient' })
  @ApiOkResponse({ type: LocalLoginResponseDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: LocalLoginDto })
  async localLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LocalLoginDto,
  ): Promise<LocalLoginResponseDto> {
    const { isMFAEnabled, patient } = await this.authService.validatePatientByEmail(body.email, body.password);

    if (!patient) throw new BadRequestException('Invalid auth credentials.');

    if (!isMFAEnabled) {
      const token = await this.authService.signJwtToken(patient.userId);

      this.requestHelper.attachJwtTokenToCookie(res, token);
    }

    return { isMFAEnabled };
  }

  @Post('login/doctor')
  @ApiOperation({ summary: 'Login doctor' })
  @ApiOkResponse({ type: undefined, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: LocalLoginDto })
  async localDoctorLogin(@Res({ passthrough: true }) res: Response, @Body() body: LocalLoginDto): Promise<void> {
    const user = await this.authService.loginDoctor(body.email, body.password);
    const token = await this.authService.signJwtToken(user.id);
    this.requestHelper.attachJwtTokenToCookie(res, token);
  }

  @Post('login/patient/mfa')
  @ApiOperation({ summary: 'Login patient with MFA' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: LocalLoginTwoFactorDto })
  async verifyMFA(@Res({ passthrough: true }) res: Response, @Body() body: LocalLoginTwoFactorDto): Promise<void> {
    const user = await this.authService.verifyMFA(body);

    const token = await this.authService.signJwtToken(user.id);

    return this.requestHelper.attachJwtTokenToCookie(res, token);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up user' })
  @ApiOkResponse({ type: ResponseUserDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: SignUpUserDto })
  async signUpUserFirstStep(@Body() body: SignUpUserDto): Promise<ResponseUserDto> {
    return await this.authService.signUpUser(body);
  }

  @Post('signup/patient/:token')
  @ApiOperation({ summary: 'Sign up patient' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: SignUpPatientDto })
  async signUpPatientSecondStep(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignUpPatientDto,
    @Param('token') signUpToken: string,
  ): Promise<void> {
    const patient = await this.authService.signUpPatient(body, signUpToken);

    const token = await this.authService.signJwtToken(patient.userId);

    return this.requestHelper.attachJwtTokenToCookie(res, token);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  @ApiOperation({ summary: 'Login with Google' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('login/google/redirect')
  @ApiOperation({ summary: 'Login with Google redirect' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async googleLoginRedirect(@UserDec() data: GoogleSignInResponseDto, @Res() res: Response) {
    if (data.isLoggedIn && data.user) {
      const token = await this.authService.signJwtToken(data.user.id);

      this.requestHelper.attachJwtTokenToCookie(res, token);

      return this.requestHelper.redirectToFrontendHomePage(res);
    } else {
      const token = await this.authService.signJwtToken(data.user.id);

      return this.requestHelper.redirectToFrontendSignUpPatientPage(res, token);
    }
  }

  @UseGuards(JWTGuard)
  @Get('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.requestHelper.clearJwtTokenFromCookie(res);
  }

  @UseGuards(JWTGuard)
  @Post('password/change')
  @ApiOperation({ summary: 'Change password' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: BadRequestException })
  @ApiBody({ type: ChangePasswordDto })
  changePassword(@Body() body: ChangePasswordDto, @UserDec() user: ResponseUserDto) {
    return this.authService.changePassword(user, body);
  }

  @UseGuards(JWTGuard)
  @Post('email/change')
  @ApiOperation({ summary: "Change user's email" })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: undefined, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: ChangeEmailDto })
  async changeEmail(@UserDec() user: ResponseUserDto, @Body() body: ChangeEmailDto): Promise<void> {
    return this.authService.changeEmail(user, body.token);
  }

  @UseGuards(JWTGuard)
  @Get('get/me')
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: MeResponseDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async getMe(@UserDec() user: ResponseUserDto): Promise<MeResponseDto> {
    return await this.authService.getMe(user);
  }

  @UseGuards(JWTGuard)
  @Get('get/me/pass')
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: Boolean, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async getIsPasswordExist(@UserDec() user: ResponseUserDto): Promise<boolean> {
    return await this.authService.getIsPasswordExist(user.email);
  }
}
