import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismadbService } from '../prismadb/prismadb.service';
import { UserDto } from './dto/user.dto';
import { UserRegisterRequest } from './dto/request/userRegister.request';
import {
  extractUsernameFromEmail,
  hashPassword,
} from '../common/utils/common.util';
import { BaseResponse } from '../dto/baseResponse.dto';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);
  constructor(private readonly prismadbService: PrismadbService) {}

  async findByUsernameOrEmail(
    username: string,
    email?: string,
    omitPass?: boolean,
  ) {
    const user = await this.prismadbService.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: username,
              mode: 'insensitive',
            },
          },
          {
            email: {
              equals: email,
              mode: 'insensitive',
            },
          },
        ],
        enabled: true,
      },
      include: {
        UserRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return BaseResponse.getSuccessResponse<UserDto>(
      UserDto.build(user, omitPass),
    );
  }

  async registerUser(userRegisterRequest: UserRegisterRequest) {
    const { email, password, phone, roleIds } = userRegisterRequest;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.prismadbService.user.create({
      data: {
        email: email.toLowerCase(),
        username: extractUsernameFromEmail(email),
        phone: phone,
        password: hashPassword(password),
        UserRoles: {
          create: roleIds.map((roleId: number) => ({
            assignedBy: 'SYSTEM',
            role: {
              connect: {
                id: roleId,
              },
            },
          })),
        },
      },
    });

    return BaseResponse.getSuccessResponse<UserDto>(UserDto.build(user, true));
  }

  async updateUserRoles(userId: number, roleIds: number[]) {
    const user = await this.prismadbService.user.update({
      where: {
        id: userId,
      },
      data: {
        UserRoles: {
          create: roleIds.map((roleId: number) => ({
            assignedBy: 'SYSTEM',
            role: {
              connect: {
                id: roleId,
              },
            },
          })),
        },
      },
    });
    return BaseResponse.getSuccessResponse<any>(user);
  }

  async disableUser(userId: number) {
    const user = await this.prismadbService.user.update({
      where: {
        id: userId,
      },
      data: {
        enabled: false,
      },
    });
    return BaseResponse.getSuccessResponse<any>(user);
  }

  async updateLastLogin(userId: number) {
    await this.prismadbService.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }
}
