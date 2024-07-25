import { ApiProperty } from '@nestjs/swagger';

export class PagingDto<T> {
  @ApiProperty({ type: [Object] }) items: T[];
  @ApiProperty() totalCount: number;
  @ApiProperty() pageIndex: number;
  @ApiProperty() pageSize: number;
}
