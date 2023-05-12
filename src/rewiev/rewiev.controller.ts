import { Controller } from '@nestjs/common';
import { RewievService } from './rewiev.service';

@Controller('rewiev')
export class RewievController {
  constructor(private readonly rewievService: RewievService) {}
}
