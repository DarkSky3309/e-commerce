import { Module } from '@nestjs/common';
import { RewievService } from './rewiev.service';
import { RewievController } from './rewiev.controller';

@Module({
  controllers: [RewievController],
  providers: [RewievService]
})
export class RewievModule {}
