import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Favorite } from 'src/schemas/favorite.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    try {
      const existUser = await this.userModel.findOne({ email: data.email });
      if (existUser) throw new ConflictException('email exist!');

      const hash = bcrypt.hashSync(data.password, 10);

      const user = await this.userModel.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hash,
      });
      user.password = undefined;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) throw new UnauthorizedException('email or password invalid');
      const checkPassword = bcrypt.compareSync(data.password, user.password);
      if (!checkPassword)
        throw new UnauthorizedException('email or password invalid');

      const payload = { _id: user._id.toString(), email: user.email };
      const tokens = await this.generateToken(payload);
      user.refresh_token = tokens.refresh_token;
      await user.save();
      return {
        ...user.toObject(),
        password: undefined,
        ...tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(_id: string) {
    try {
      const user = await this.userModel.findById(_id);
      return {
        ...user.toObject(),
        refresh_token: undefined,
        password: undefined,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(data: RefreshTokenDto) {
    try {
      const payload: { _id: string; email: string } =
        await this.jwtService.verifyAsync(data.refresh_token, {
          secret: this.config.get('JWT_REFRESH_SECRET'),
        });
      const user = await this.userModel.findById(payload._id);
      if (data.refresh_token !== user.refresh_token) {
        throw new UnauthorizedException();
      }

      const tokens = await this.generateToken({
        _id: payload._id,
        email: payload.email,
      });

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async getFavorites(userId: string, page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    try {
      const totalCountPromise = this.favoriteModel.count({ userId });
      const favoriteMoviesPromise = this.favoriteModel
        .find({ userId })
        .skip(startIndex)
        .limit(limit)
        .sort('createdAt');

      const [favoriteMovies, totalCount] = await Promise.all([
        favoriteMoviesPromise,
        totalCountPromise,
      ]);

      const prev_page = page <= 1 ? null : page - 1;
      const next_page = page * limit >= totalCount ? null : page + 1;

      return {
        totalDoc: totalCount,
        page,
        limit,
        docs: favoriteMovies,
        prev_page,
        next_page,
      };
    } catch (error) {
      throw error;
    }
  }

  private async generateToken(payload: { _id: string; email: string }) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '100d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
