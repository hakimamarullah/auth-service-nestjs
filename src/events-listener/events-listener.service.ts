import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '../users/users.service';
import { EventConstant } from './event-key.constant';
import { RolesService } from '../roles/roles.service';
import { convertPatternToRegExp } from '../common/utils/common.util';

@Injectable()
export class EventsListenerService {
  private logger: Logger = new Logger(EventsListenerService.name);
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {}

  @OnEvent(EventConstant.EventKey.UPDATE_LAST_LOGIN, { async: true })
  async updateUserLastLogin(payload: any) {
    await this.usersService.updateLastLogin(payload);
  }

  @OnEvent(EventConstant.EventKey.RELOAD_ALL_PATHS, { async: true })
  async reloadAllPaths() {
    await this.rolesService.loadAllPaths<RegExp>(convertPatternToRegExp);
    this.logger.log(`All Paths Reloaded.`);
  }
}
