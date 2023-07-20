import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, HydratedDocument } from 'mongoose';

@Schema({ collection: 'favorites', timestamps: true })
export class Favorite {
  @Prop({ required: true })
  movieId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'users',
    required: true,
    index: true,
  })
  userId: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export type FavoriteDocument = HydratedDocument<Favorite>;
export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
