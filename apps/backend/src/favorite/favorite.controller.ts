import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { CreateFavoriteDto } from './dto/create.dto';
import { ResponseFavoriteDto } from './dto/response.dto';
import { FavoriteService } from './favorite.service';
import JWTGuard from '../auth/gaurds/jwt.guard';
import { UserDec } from '../user/user.decorator';
import { PatientService } from '../patient/patient.service';
import { RolesGuard } from '../auth/gaurds/role.guard';
import { Role } from '../auth/decorators/roles.decorator';

@ApiTags('Favorite Endpoints')
@Controller('favorite')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly patientService: PatientService,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Role('PATIENT')
  @Post()
  @ApiOperation({ summary: 'Create favorite' })
  @ApiOkResponse({ type: ResponseFavoriteDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreateFavoriteDto })
  async createFavorite(@UserDec() userInfo, @Body() body: CreateFavoriteDto) {
    const patient = await this.patientService.getPatientByUserId(userInfo.id);
    return this.favoriteService.createFavorite(patient.id, body);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Role('PATIENT')
  @Get()
  @ApiOperation({ summary: 'Get favorites' })
  @ApiOkResponse({ type: ResponseFavoriteDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async getFavorites(@UserDec() userInfo) {
    const patient = await this.patientService.getPatientByUserId(userInfo.id);
    return this.favoriteService.getFavorites(patient.id);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Role('PATIENT')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete favorite' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  async deleteFavorite(@Param('id') id: string, @UserDec() userInfo) {
    const patient = await this.patientService.getPatientByUserId(userInfo.id);
    return this.favoriteService.deleteFavorite(patient.id, id);
  }
}
