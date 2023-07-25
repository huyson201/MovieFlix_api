import { IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @ValidateIf((obj: UpdateProfileDto) => {
    return obj.last_name !== undefined;
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ValidateIf((obj: UpdateProfileDto) => {
    return obj.first_name !== undefined;
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ValidateIf((obj: UpdateProfileDto) => {
    return obj.new_password !== undefined;
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  old_password: string;

  @ValidateIf((obj: UpdateProfileDto) => {
    return obj.old_password !== undefined;
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  new_password: string;
}
