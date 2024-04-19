import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Title, Country } from "@prisma/client";

export class ClientDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  title: Title;

  @IsNotEmpty()
  @IsString()
  country: Country;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
