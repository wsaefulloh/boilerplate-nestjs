import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Boolean)
  @IsDefined()
  @IsBoolean()
  is_active: boolean;
}
