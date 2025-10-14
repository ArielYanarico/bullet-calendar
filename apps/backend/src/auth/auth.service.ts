import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async googleLogin(googleUser: GoogleUser) {
    try {
      let user: any = await this.usersService.findOneByEmail(googleUser.email);

      if (!user) {
        user = await this.usersService.create({
          username: googleUser.email,
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          picture: googleUser.picture,
          googleAccessToken: googleUser.accessToken,
          googleRefreshToken: googleUser.refreshToken,
        });
      } else {
        user = await this.usersService.update(user.id, {
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          picture: googleUser.picture,
          googleAccessToken: googleUser.accessToken,
          googleRefreshToken: googleUser.refreshToken,
        });
      }

      const payload = {
        sub: user.id,
        email: user.email,
        username: user.username
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
        },
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async validateUser(payload: any) {
    return await this.usersService.findOne(payload.sub);
  }
}
