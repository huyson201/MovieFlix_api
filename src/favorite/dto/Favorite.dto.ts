import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum VideoType {
  MOVIE = 'movie',
  TV = 'tv',
}
export class FavoriteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(VideoType)
  type: 'movie' | 'tv';
}
