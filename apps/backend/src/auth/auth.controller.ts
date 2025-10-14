import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

@Controller('auth')
export class AuthController {
  
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    const { access_token, user } = req.user as any;
    res.redirect(`${frontendUrl}/auth/callback?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return req.user;
  }

  @Get('logout')
  async logout(@Res() res) {
    res.redirect(`${frontendUrl}/login`);
  }
}
