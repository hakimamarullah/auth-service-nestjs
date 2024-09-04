import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '../users/users.service';
import { EventConstant } from './event-key.constant';

@Injectable()
export class EventsListenerService {
  constructor(private usersService: UsersService) {}

  @OnEvent(EventConstant.EventKey.UPDATE_LAST_LOGIN, { async: true })
  async updateUserLastLogin(payload: any) {
    await this.usersService.updateLastLogin(payload);
  }
}
