import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

export class UserRegisterRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 255, {
    message: 'Password length must be between 6 and 255 characters',
  })
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString(
    { no_symbols: true },
    { message: 'Phone must be a valid phone number' },
  )
  phone?: string;

  @ApiProperty()
  @IsArray({ message: 'Role ids must be an array' })
  @IsNumber(
    { allowNaN: false },
    { message: 'Role ids should only contain numbers', each: true },
  )
  roleIds: number[];
}
