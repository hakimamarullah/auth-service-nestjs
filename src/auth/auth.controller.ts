import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UserRegisterRequest } from '../users/dto/request/userRegister.request';
import { ApiBaseResponse } from '../common/decorators/swagger.decorator';
import { SignInRequest } from './dto/request/signIn.request';
import { TokenResponse } from './dto/response/token.response';
import { Public } from './decorator/public.decorator';

@ApiTags('AuthController')
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBaseResponse({ model: UserRegisterRequest, statusCode: 201 })
  @ApiBody({ type: UserRegisterRequest })
  async registerUser(@Body() userRegisterRequest: UserRegisterRequest) {
    return await this.usersService.registerUser(userRegisterRequest);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get access token' })
  @ApiBaseResponse({ model: TokenResponse })
  @ApiBaseResponse({
    model: Object,
    statusCode: 401,
    description: 'Unauthorized',
  })
  @ApiBody({ type: SignInRequest })
  async signIn(@Body() signInRequest: SignInRequest) {
    return await this.authService.signIn(signInRequest);
  }
}
