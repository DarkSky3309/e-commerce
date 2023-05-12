import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {
  id: number;
  @IsOptional()
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsOptional()
  @IsString()
  avatarPath: string;
  @IsString()
  @IsOptional()
  phone?: string;
}
