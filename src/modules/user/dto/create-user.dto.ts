import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string; //'aluno' | 'colaborador' | 'dti';
}
