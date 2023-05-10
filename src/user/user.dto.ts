import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
  id: number;
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsString()
  avatarPath: string;
  @IsString()
  @IsOptional()
  phone?: string;
}
