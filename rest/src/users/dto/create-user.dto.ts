import {
  IsString,
  IsEmail,
  IsEnum,
  IsUUID,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/enum/role.enum';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
