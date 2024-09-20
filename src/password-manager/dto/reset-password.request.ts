import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordRequest {
  @ApiProperty()
  @IsString({ message: 'Token should be a string' })
  @IsNotEmpty({ message: 'Token should not be empty' })
  token: string;

  @ApiProperty()
  @IsString({ message: 'New password should be a string' })
  @MinLength(6, { message: 'New password should be at least 6 characters' })
  newPassword: string;
}
