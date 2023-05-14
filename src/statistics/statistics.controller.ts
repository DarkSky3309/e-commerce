import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthDecorator } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/user.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('main')
  @AuthDecorator()
async getMainStatistics(@CurrentUser('id') id: number) {
    return this.statisticsService.getMainStatistics(id);
  }
}
