import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import JWTGuard from '../auth/gaurds/jwt.guard';
import { MinioService } from '../minio/minio.service';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { UnauthorizedResponse } from '../utils/UnauthorizedResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { ResponseFileDto } from './dto/response.dto';
import { UserDec } from '../user/user.decorator';
import { PatientService } from '../patient/patient.service';

@ApiTags('File Endpoints')
@Controller('file')
export class FileController {
  constructor(
    private readonly minioService: MinioService,
    private readonly patientService: PatientService,
  ) {}

  @UseGuards(JWTGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @ApiOperation({ summary: 'Upload file' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: ResponseFileDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ schema: { properties: { file: { type: 'string', format: 'binary' } } } })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = await this.minioService.upload(file);
    return response;
  }

  @UseGuards(JWTGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('uploadIdentityCard')
  @ApiOperation({ summary: 'uploadIdentityCard file' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: ResponseFileDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({
    schema: {
      type: 'object', // Ensure to define it as an object
      properties: {
        file: { type: 'string', format: 'binary' },
        identityCardType: { type: 'string' }, // Adding the new property
      },
      required: ['file', 'identityCardType'], // Optional: Specify required fields
    },
  })
  async uploadIdentityCard(
    @UploadedFile() file: Express.Multer.File,
    @Body() identityCardType: string,
    @UserDec() userInfo,
  ) {
    const patient = await this.patientService.getPatientByUserId(userInfo.id);
    const response = await this.minioService.uploadIdentityCard(file, identityCardType, patient);
    return response;
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get file' })
  @ApiOkResponse({ type: ResponseFileDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'name', example: '123e4567-e89b-12d3-a456-426614174000.png', description: 'Unique file name.' })
  async getFileByName(@Param('name') name: string) {
    const response = await this.minioService.getFileByName(name);
    return response;
  }

  @UseGuards(JWTGuard)
  @Delete(':name')
  @ApiOperation({ summary: 'Delete file' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'name', example: '123e4567-e89b-12d3-a456-426614174000.png', description: 'Unique file name.' })
  async deleteFileByName(@Param('name') name: string) {
    return await this.minioService.deleteFileByName(name);
  }
}
