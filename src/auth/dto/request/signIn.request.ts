import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequest {
  @ApiProperty({ description: 'username or email', example: 'admin' })
  @IsNotEmpty({ message: 'username or email is required' })
  @IsString({ message: 'username or email must be a string' })
  username: string;

  @ApiProperty({ description: 'password', example: 'admin123' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
