import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '@users/users.service';
import { Strategy, Profile } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GCP_CLIENTID'),
      clientSecret: configService.get<string>('GCP_CLIENTSECRET'),
      callbackURL: configService.get<string>('GCP_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ) {
    const { id, emails, photos, displayName } = profile;
    const findUser = await this.usersService.findOneByUsername(emails[0].value);
    if (findUser) {
      done(null, { ...findUser, accessToken });
    }
    const user = {
      id: id,
      email: emails[0].value,
      name: displayName,
      avatar: photos[0].value,
    };
    done(null, { ...user, accessToken });
  }
}
