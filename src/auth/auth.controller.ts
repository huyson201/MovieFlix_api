import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { User } from 'src/decorators/user.decorator';
import { FavoriteQueryDto } from './dto/getFavoriteQuery.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Return user's profile" })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get('profile')
  getUsers(@Req() req: Request) {
    return this.authService.getProfile(req.user._id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Return user's list of favorite movies",
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get('favorites')
  getFavorites(
    @User() user: { _id: string; email: string },
    @Query() query: FavoriteQueryDto,
  ) {
    const { page, limit } = query;
    return this.authService.getFavorites(user._id, page, limit);
  }

  @ApiResponse({
    status: 200,
    description: "Return user's registered info",
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiResponse({
    status: 200,
    description: "Return tokens and user's info",
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Return access token and refresh token',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh_token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
}
