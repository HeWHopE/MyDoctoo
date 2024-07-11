import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGY_NAME } from '../../utils/constants';

@Injectable()
export default class JWTGuard extends AuthGuard(JWT_STRATEGY_NAME) {}
