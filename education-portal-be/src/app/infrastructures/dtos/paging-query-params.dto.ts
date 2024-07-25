import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '../constants';

export class PagingQueryParamsDto {
  @ApiProperty({ type: Number, nullable: true, default: DEFAULT_PAGE_INDEX })
  @IsOptional()
  readonly pageIndex: number = DEFAULT_PAGE_INDEX;

  @ApiProperty({ type: Number, nullable: true, default: DEFAULT_PAGE_SIZE })
  @IsOptional()
  readonly pageSize: number = DEFAULT_PAGE_SIZE;
}
