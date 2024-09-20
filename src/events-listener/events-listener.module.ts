import { Module } from '@nestjs/common';
import { EventsListenerService } from './events-listener.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersService } from '../users/users.service';
import { PrismadbService } from '../prismadb/prismadb.service';
import { RolesService } from '../roles/roles.service';
import { CachingService } from '@hakimamarullah/commonbundle-nestjs';
import { ProducerService } from '@hakimamarullah/event-producer';

@Module({
  providers: [
    EventsListenerService,
    UsersService,
    PrismadbService,
    RolesService,
    CachingService,
    ProducerService,
  ],
  imports: [EventEmitterModule.forRoot({ global: true })],
  exports: [EventsListenerService],
})
export class EventsListenerModule {}
