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
        { userId: user._id, id: dto.id, type: dto.type },
        {
          $set: {
            id: dto.id,
            userId: user._id,
            type: dto.type,
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
      return this.favoriteModel.findOneAndDelete({
        id: dto.id,
        userId: user._id,
        type: dto.type,
      });
    } catch (error) {
      throw error;
    }
  }

  async checkAddedToFavorites(dto: FavoriteDto, user: AuthData) {
    try {
      const favoriteMovie = await this.favoriteModel.findOne({
        userId: user._id,
        id: dto.id,
        type: dto.type,
      });

      return {
        added: favoriteMovie ? true : false,
      };
    } catch (error) {
      throw error;
    }
  }
}
