import { PaginationDto } from '../../pagination/pagination.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumProductSort {
  HIGH_TO_LOW = 'high-to-low',
  LOW_TO_HIGH = 'low-to-high',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class GetAllProductDto extends PaginationDto{
  @IsOptional()
  @IsEnum(EnumProductSort)
  sort?: EnumProductSort;

  @IsOptional()
  @IsString()
  searchTerms?: string;
}