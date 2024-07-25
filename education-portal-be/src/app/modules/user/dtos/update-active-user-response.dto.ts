import { ApiProperty } from '@nestjs/swagger';

export class UpdateActiveStatusUserResponseDto {
  @ApiProperty() isActive: boolean;
}
