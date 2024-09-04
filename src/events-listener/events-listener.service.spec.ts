import { Test, TestingModule } from '@nestjs/testing';
import { EventsListenerService } from './events-listener.service';

describe('EventsListenerService', () => {
  let service: EventsListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsListenerService],
    }).compile();

    service = module.get<EventsListenerService>(EventsListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
