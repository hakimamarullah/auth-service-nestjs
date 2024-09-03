import { Injectable } from '@nestjs/common';
import { PrismadbService } from '../prismadb/prismadb.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismadbService: PrismadbService) {}
}
