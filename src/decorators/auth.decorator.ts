import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const AuthDecorator = () => UseGuards(AuthGuard('jwt'));
