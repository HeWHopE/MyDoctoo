import { ResponseUserDto } from '../../user/dto/response.dto';

export class GoogleSignInResponseDto {
  isLoggedIn: boolean;
  user: ResponseUserDto;
}
