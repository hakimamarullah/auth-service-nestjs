import { Test, TestingModule } from '@nestjs/testing';
import { PasswordManagerController } from './password-manager.controller';

describe('PasswordManagerController', () => {
  let controller: PasswordManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordManagerController],
    }).compile();

    controller = module.get<PasswordManagerController>(
      PasswordManagerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
