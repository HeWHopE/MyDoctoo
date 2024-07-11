import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import JWTGuard from '../auth/gaurds/jwt.guard';
import { PatientService } from '../patient/patient.service';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { UnauthorizedResponse } from '../utils/UnauthorizedResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { AvgRateResponse } from './dto/avgRateResponse.dto';
import { CreateReviewDto } from './dto/create.dto';
import { PatchReviewDto } from './dto/patch.dto';
import { ResponseReviewDto } from './dto/response.dto';
import { ResponseReviewDtoWithNames } from './dto/responseWithNames.dto';
import { ReviewService } from './review.service';

@ApiTags('Review Endpoints')
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly patientService: PatientService,
  ) {}

  @UseGuards(JWTGuard)
  @Post('doctor/:doctorId')
  @ApiOperation({ summary: 'Create a new review' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseReviewDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreateReviewDto })
  async createReview(
    @Req() req: Request,
    @Param('doctorId') doctorId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const user = req['user'];

    const patient = await this.patientService.getPatientByUserId(user.id);

    return this.reviewService.createReview(patient.id, doctorId, createReviewDto.rate, createReviewDto.text);
  }

  @Get()
  @ApiOperation({ summary: 'Get reviews' })
  @ApiOkResponse({ type: ResponseReviewDtoWithNames, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'includeNames', example: false, description: 'Include names in reviews.' })
  @ApiParam({ name: 'skip', example: 1, description: 'How many reviews should be skipped.' })
  @ApiParam({ name: 'take', example: 50, description: 'How many reviews should be taken.' })
  getReviews(
    @Query('includeNames') includeNames?: string,
    @Query('skip') skipQuery?: string,
    @Query('take') takeQuery?: string,
  ) {
    const skip = skipQuery ? Number(skipQuery) : undefined;
    const take = takeQuery ? Number(takeQuery) : undefined;

    // TODO: Add better validation.
    if (skipQuery && isNaN(skip)) {
      throw new BadRequestException('Skip query parameter must be a number.');
    }

    if (takeQuery && isNaN(take)) {
      throw new BadRequestException('Take query parameter must be a number.');
    }

    return this.reviewService.getReviews({ includeNames: includeNames === 'true', skip, take });
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get reviews by doctor' })
  @ApiOkResponse({ type: ResponseReviewDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'includeNames', example: false, description: 'Include names in reviews.' })
  @ApiParam({ name: 'skip', example: 1, description: 'How many reviews should be skipped.' })
  @ApiParam({ name: 'take', example: 50, description: 'How many reviews should be taken.' })
  getReviewsByDoctorId(
    @Param('doctorId') doctorId: string,
    @Query('includeNames') includeNames: string,
    @Query('skip') skipQuery: string,
    @Query('take') takeQuery: string,
  ) {
    const skip = skipQuery ? Number(skipQuery) : undefined;
    const take = takeQuery ? Number(takeQuery) : undefined;

    // TODO: Add better validation.
    if (skipQuery && isNaN(skip)) {
      throw new BadRequestException('Skip query parameter must be a number.');
    }

    if (takeQuery && isNaN(take)) {
      throw new BadRequestException('Take query parameter must be a number.');
    }

    return this.reviewService.getReviews({ doctorId: doctorId, includeNames: includeNames === 'true', skip, take });
  }

  @Get('doctor/:doctorId/average')
  @ApiOperation({ summary: 'Get the average rating of a doctor' })
  @ApiOkResponse({ type: AvgRateResponse, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'doctorId', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  async getAvgRateByDoctorId(@Param('doctorId') doctorId: string) {
    return this.reviewService.getAvgRateByDoctorId(doctorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review' })
  @ApiOkResponse({ type: ResponseReviewDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique review id.' })
  async getReview(@Param('id') id: string) {
    const review = await this.reviewService.getReview(id);

    delete review.patientId;

    return review;
  }

  @UseGuards(JWTGuard)
  @Patch('/:reviewId')
  @ApiOperation({ summary: 'Update a review' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseReviewDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: PatchReviewDto })
  async patchReview(@Req() req: Request, @Param('reviewId') reviewId: string, @Body() body: PatchReviewDto) {
    const user = req['user'];

    const patient = await this.patientService.getPatientByUserId(user.id);

    return this.reviewService.patchReview(reviewId, patient.id, body);
  }

  @UseGuards(JWTGuard)
  @Delete('/:reviewId')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async deleteReview(@Req() req: Request, @Param('reviewId') reviewId: string) {
    const user = req['user'];

    const patient = await this.patientService.getPatientByUserId(user.id);

    return this.reviewService.deleteReview(reviewId, patient.id);
  }
}
