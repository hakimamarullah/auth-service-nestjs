import { Test, TestingModule } from '@nestjs/testing';
import { PasswordManagerService } from './password-manager.service';

describe('PasswordManagerService', () => {
  let service: PasswordManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordManagerService],
    }).compile();

    service = module.get<PasswordManagerService>(PasswordManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
