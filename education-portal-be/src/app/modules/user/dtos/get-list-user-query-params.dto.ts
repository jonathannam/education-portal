import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/app/infrastructures/constants';
import { PagingQueryParamsDto } from 'src/app/infrastructures/dtos';

export class GetListUserQueryParamsDto extends PagingQueryParamsDto {
  @ApiProperty({ nullable: true }) readonly username?: string;
  @ApiProperty({ nullable: true })
  @Type(() => Boolean)
  readonly isActive?: boolean;
  @ApiProperty({ nullable: true })
  @IsEnum(Role, { message: 'Role must be a valid value' })
  @IsOptional()
  readonly role?: Role;
}
