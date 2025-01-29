import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  name: string; //acd, ge

  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @IsString()
  @IsNotEmpty()
  patrimony: string;

  @IsString()
  @IsNotEmpty()
  location: string; //adm, sala1, lab1

  @IsOptional()
  status?: string;
}
