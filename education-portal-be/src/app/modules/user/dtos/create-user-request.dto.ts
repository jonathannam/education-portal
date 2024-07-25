import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/app/infrastructures/constants';

export class CreateUserRequestDto {
  @ApiProperty() @IsNotEmpty() readonly username: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Role must be a valid value' })
  readonly role: Role;
  @ApiProperty() @IsNotEmpty() readonly password: string;
}
