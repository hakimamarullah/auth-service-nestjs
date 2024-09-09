import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiBaseResponse } from '../common/decorators/swagger.decorator';

@ApiBearerAuth()
@ApiTags('UserController')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/:username/details')
  @ApiOperation({ summary: 'Get user info details by username or email' })
  @ApiBaseResponse({ model: UserDto })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'username',
    type: String,
    description: 'username or email',
  })
  async getUserInfo(@Param('username') username: string) {
    return await this.userService.findByUsernameOrEmail(
      username,
      username,
      true,
    );
  }
}
