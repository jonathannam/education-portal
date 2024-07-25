import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty() id: number;
  @ApiProperty() username: string;
  @ApiProperty() role: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty() isActive: boolean;
}
