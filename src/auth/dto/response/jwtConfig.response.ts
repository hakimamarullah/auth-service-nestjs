import { ApiProperty } from '@nestjs/swagger';

class VerifyOptions {
  @ApiProperty()
  ignoreExpiration: boolean;
}

class SignOptions {
  @ApiProperty()
  expiresIn: string;
}

export class JwtConfigResponse {
  @ApiProperty()
  secret: string;

  @ApiProperty()
  global: boolean;

  @ApiProperty()
  verifyOptions: VerifyOptions;

  @ApiProperty()
  signOptions: SignOptions;
}
