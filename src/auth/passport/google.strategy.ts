import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
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
    const user = {
      id: id,
      email: emails[0].value,
      name: displayName,
      avatar: photos[0].value,
    };
    done(null, user);
    return user;
  }
}
