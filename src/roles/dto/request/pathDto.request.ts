import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PathDto {
  @ApiProperty({
    example: ['/users'],
    description: 'Path/URL',
    isArray: true,
    type: 'string',
  })
  @IsArray({ message: 'Path must be an array of string' })
  paths: string[];

  @ApiProperty({ example: 'ADMIN', description: 'Role name' })
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be a string' })
  roleName: string;
}
