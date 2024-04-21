import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from "class-validator";

// Custom validator for matching fields
@ValidatorConstraint({ name: "MatchFields", async: false })
export class MatchFieldsValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `$property must match ${relatedPropertyName}`;
  }
}
export class AuthRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Validate(MatchFieldsValidator, ["password"])
  confirmPassword: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;
}

export class AuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthPatchDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateIf((obj) => obj.email !== undefined) // Check if email is provided
  @IsNotEmpty()
  @IsEmail()
  @Validate(MatchFieldsValidator, ["email"])
  confirmEmail?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @ValidateIf((obj) => obj.password !== undefined) // Check if password is provided
  @IsNotEmpty()
  @IsString()
  @Validate(MatchFieldsValidator, ["password"])
  confirmPassword?: string;
  // Add other optional fields as needed, but exclude password-related fields
}
