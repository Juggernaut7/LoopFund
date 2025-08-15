import dotenv from 'dotenv';

dotenv.config();

const required = (name: string, value: string | undefined): string => {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  mongoUri: required('MONGODB_URI', process.env.MONGODB_URI),
  jwtSecret: required('JWT_SECRET', process.env.JWT_SECRET),
  corsOrigin: process.env.CORS_ORIGIN || '*',
}; 