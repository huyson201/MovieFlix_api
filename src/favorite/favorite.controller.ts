import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FavoriteDto } from './dto/Favorite.dto';
import { AuthData } from 'src/express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('check')
  checkFavorite(@Body() dto: FavoriteDto, @User() user: AuthData) {
    return this.favoriteService.checkAddedToFavorites(dto, user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  createFavorite(@Body() dto: FavoriteDto, @User() user: AuthData) {
    return this.favoriteService.createFavorite(dto, user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(204)
  deleteFavorite(@Body() dto: FavoriteDto, @User() user: AuthData) {
    return this.favoriteService.deleteFavorite(dto, user);
  }
}
