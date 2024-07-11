import { ConfigType } from '@nestjs/config';
import auth from './auth';
import mail from './mail';
import config from './config';

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const mockConfig = {
      STRIPE_API_KEY: 'sk_test_cnkdjsmckd',
      MINIO_ENDPOINT: 'minio-endpoint',
      MINIO_PORT: 'minio-port',
      MINIO_USE_SSL: 'true',
      MAIL_FROM: 'test',
      MAIL_HOST: 'test',
      MAIL_PASS: 'test',
      MAIL_PORT: 1025,
      MAIL_SECURE: false,
      MAIL_USER: 'test',
      GOOGLE_CLIENT_ID: 'test',
      GOOGLE_CLIENT_SECRET: 'test',
      GOOGLE_REDIRECT_URL: '/',
      JWT_EXPIRATION_DAYS: '1',
      JWT_EXPIRATION_TRESHOLD_SECONDS: 200,
      JWT_SECRET: 'secret',
      SALT_ROUNDS: 10,
      NODE_ENV: 'test',
      APP_NAME: 'test',
      BACKEND_URL: '',
      FRONTEND_URL: '',
      FRONTEND_SIGNUP_PATH: '',
      FRONTEND_CHANGE_EMAIL_PATH: '',
    };
    return mockConfig[key];
  }),
};

export const mockAuthConfig: ConfigType<typeof auth> = {
  GOOGLE_CLIENT_ID: 'test',
  GOOGLE_CLIENT_SECRET: 'test',
  GOOGLE_REDIRECT_URL: '/',
  JWT_EXPIRATION_DAYS: '1',
  JWT_EXPIRATION_TRESHOLD_SECONDS: 1000,
  JWT_SECRET: 'secret',
  SALT_ROUNDS: 10,
};

export const mockMailConfig: ConfigType<typeof mail> = {
  MAIL_FROM: 'test',
  MAIL_HOST: 'test',
  MAIL_PASS: 'test',
  MAIL_PORT: 1025,
  MAIL_SECURE: false,
  MAIL_USER: 'test',
};

export const mockConfig: ConfigType<typeof config> = {
  NODE_ENV: 'test',
  APP_NAME: 'test',
  BACKEND_URL: '',
  FRONTEND_URL: '',
  FRONTEND_SIGNUP_PATH: '',
  FRONTEND_CHANGE_EMAIL_PATH: '',
};
