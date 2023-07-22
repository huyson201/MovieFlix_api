import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  HttpCode,
  Get,
  UseFilters,
  Query,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FavoriteDto } from './dto/Favorite.dto';
import { AuthData } from 'src/express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BadRequestExceptionFilter } from 'src/ExceptionFilter/BadRequestException.filter';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseFilters(BadRequestExceptionFilter)
  @HttpCode(200)
  @Get('check')
  checkFavorite(@Query() dto: FavoriteDto, @User() user: AuthData) {
    return this.favoriteService.checkAddedToFavorites(dto, user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseFilters(BadRequestExceptionFilter)
  @HttpCode(201)
  @Post()
  createFavorite(@Body() dto: FavoriteDto, @User() user: AuthData) {
    return this.favoriteService.createFavorite(dto, user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseFilters(BadRequestExceptionFilter)
  @Delete()
  @HttpCode(200)
  deleteFavorite(@Body() dto: FavoriteDto, @User() user: AuthData) {
    return this.favoriteService.deleteFavorite(dto, user);
  }
}
