import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInRequest } from './dto/request/signIn.request';
import { LoginResponse } from './dto/response/login.response';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventConstant } from '../events-listener/event-key.constant';
import {
  BaseResponse,
  CachingService,
  isPasswordValid,
} from '@hakimamarullah/commonbundle-nestjs';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cachingService: CachingService,
    private eventEmitter: EventEmitter2,
  ) {}

  async signIn(
    signInRequest: SignInRequest,
  ): Promise<BaseResponse<LoginResponse>> {
    const loginResponse = new LoginResponse();
    try {
      const { username, password } = signInRequest;
      const { responseData } = await this.usersService.findByUsernameOrEmail(
        username,
        username,
        false,
      );
      const {
        id,
        username: oriUsername,
        password: hashedPassword,
        roles,
      } = responseData ?? {};
      const payload = {
        sub: id,
        username: oriUsername,
      };

      if (this.passwordMatch(password, hashedPassword)) {
        loginResponse.accessToken = await this.jwtService.signAsync(payload);
        loginResponse.username = <string>oriUsername;
        loginResponse.roles = roles ?? [];
        this.eventEmitter.emit(EventConstant.EventKey.UPDATE_LAST_LOGIN, id);
        await this.cachingService.setRoles(id, roles);
      }
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(error.message);
    }
    return BaseResponse.getResponse<LoginResponse>(loginResponse);
  }

  private passwordMatch(password: any, hashedPassword: any) {
    if (
      !password ||
      !hashedPassword ||
      !isPasswordValid(password, hashedPassword)
    ) {
      throw new UnauthorizedException('Password invalid');
    }
    return true;
  }
}
