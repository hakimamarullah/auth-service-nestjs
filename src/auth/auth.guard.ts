import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismadbService } from '../prismadb/prismadb.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from './decorator/public.decorator';
import { CachingService } from '../caching/caching.service';
import { RolesService } from '../roles/roles.service';
import { CacheConstant } from '../caching/cache.constant';
import { convertPatternToRegExp } from '../common/utils/common.util';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger: Logger = new Logger(AuthGuard.name);
  constructor(
    private prismaService: PrismadbService,
    private jwtService: JwtService,
    private reflector: Reflector,
    private cachingService: CachingService,
    private roleService: RolesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const userRoles = await this.getUserRoles(payload.sub);
      const paths = await this.getAllPaths();
      const pathsSet = await this.getPathPatternSet(userRoles, paths ?? {});
      this.checkIsAllowed(pathsSet, request.path);
      (request as any)['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async getUserRoles(userId: number) {
    let roles = await this.cachingService.getRolesByUserId(userId);
    if (!roles) {
      const { responseData } = await this.roleService.getUserRoles(userId);
      if (!responseData) {
        throw new UnauthorizedException('no roles found');
      }
      roles = responseData as string[];
      await this.cachingService.setRoles(userId, roles);
    }
    return roles;
  }

  private async getAllPaths() {
    const rolesPaths = await this.cachingService.get<{
      [roleName: string]: RegExp[];
    }>(CacheConstant.CacheKey.ROLES_PATHS);
    if (!rolesPaths) {
      await this.roleService.loadAllPaths(convertPatternToRegExp);
    }
    return await this.cachingService.get<{ [roleName: string]: RegExp[] }>(
      CacheConstant.CacheKey.ROLES_PATHS,
    );
  }

  private async getPathPatternSet(
    userRoles: string[],
    paths: { [roleName: string]: RegExp[] },
  ) {
    const patternSet = new Set<RegExp>();
    for (const role of userRoles) {
      const userPaths = paths[role];
      if (userPaths) {
        userPaths.forEach((pattern) => {
          patternSet.add(pattern);
        });
      }
    }
    return patternSet;
  }

  private checkIsAllowed(pathPatternSet: Set<RegExp>, path: string) {
    const anyMatchedPath = Array.from(pathPatternSet).some((pattern) =>
      pattern.test(path),
    );
    if (!pathPatternSet) {
      throw new UnauthorizedException(
        'You are not allowed to access this path',
      );
    }
    if (!pathPatternSet.size) {
      throw new UnauthorizedException(
        'You are not allowed to access this path',
      );
    }

    if (!anyMatchedPath) {
      throw new UnauthorizedException(
        'You are not allowed to access this path',
      );
    }
    return true;
  }
}
