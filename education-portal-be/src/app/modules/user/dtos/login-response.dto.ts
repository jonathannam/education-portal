import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty() username: string;
  @ApiProperty() role: string;
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
}
