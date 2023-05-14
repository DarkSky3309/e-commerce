import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthDecorator } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @AuthDecorator()
  getOrders(@CurrentUser('id') id: number) {
    return this.orderService.getOrders(id);
  }
}
