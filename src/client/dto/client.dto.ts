import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Title, Country } from "@prisma/client";

export class ClientDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsEnum(Title)
  title: Title;

  @IsNotEmpty()
  @IsEnum(Country)
  country: Country;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
