import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ type: [String], isArray: true })
  roles: string[];
}
