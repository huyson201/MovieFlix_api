import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from 'src/schemas/favorite.schema';
import { FavoriteDto } from './dto/Favorite.dto';
import { AuthData } from 'src/express';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  ) {}

  async createFavorite(dto: FavoriteDto, user: AuthData) {
    try {
      const favoriteMovie = this.favoriteModel.findOneAndUpdate(
        { userId: user._id, movieId: dto.movieId },
        {
          $set: {
            movieId: dto.movieId,
            userId: user._id,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );
      return favoriteMovie;
    } catch (error) {
      throw error;
    }
  }

  async deleteFavorite(dto: FavoriteDto, user: AuthData) {
    try {
      this.favoriteModel.findOneAndDelete({
        movieId: dto.movieId,
        userId: user._id,
      });
    } catch (error) {
      throw error;
    }
  }

  async checkAddedToFavorites(dto: FavoriteDto, user: AuthData) {
    try {
      const favoriteMovie = await this.favoriteModel.findOne({
        userId: user._id,
        movieId: dto.movieId,
      });

      return {
        added: favoriteMovie ? true : false,
      };
    } catch (error) {
      throw error;
    }
  }
}
