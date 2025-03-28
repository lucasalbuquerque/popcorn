import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  price: number;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  attributes?: {
    color?: string;
    size?: string;
    [key: string]: any;
  };
}
