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
  BaseResponse,
  extractUsernameFromEmail,
  hashPassword,
} from '@hakimamarullah/commonbundle-nestjs';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);
  constructor(private readonly prismadbService: PrismadbService) {}

  async findByUsernameOrEmail(
    username: string,
    email?: string,
    omitPass?: boolean,
  ) {
    const conditions: any[] = [
      {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    ];

    // Add the email condition only if email is provided
    if (email) {
      conditions.push({
        email: {
          equals: email,
          mode: 'insensitive',
        },
      });
    }

    const user = await this.prismadbService.user.findFirst({
      where: {
        OR: conditions,
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

    return BaseResponse.getResponse<UserDto>(UserDto.build(user, omitPass));
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

    return BaseResponse.getResponse<UserDto>(UserDto.build(user, true));
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
    return BaseResponse.getResponse<any>(user);
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
    return BaseResponse.getResponse<any>(user);
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
