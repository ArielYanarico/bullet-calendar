import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  
  constructor() {}

  private createAuthClient(accessToken: string, refreshToken?: string) {
    const auth = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_CALLBACK_URL,
    });

    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    return auth;
  }

  async listEvents(accessToken: string, calendarId: string = 'primary', options?: any) {
    try {
      if (!accessToken) {
        return [];
      }
      const auth = this.createAuthClient(accessToken);
      const calendar = google.calendar({ version: 'v3', auth });
      const response = await calendar.events.list({
        calendarId,
        ...options,
      });
      return response.data.items || [];
    } catch (error) {
      return [];
    }
  }
}
