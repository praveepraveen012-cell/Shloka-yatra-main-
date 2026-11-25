import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET =
  process.env.JWT_SECRET || 'shlloka_yatra_secure_production_secret_key_2027_kailash';

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn(
    '[SECURITY CRITICAL WARNING] JWT_SECRET is not set in production environment variables! Using default fallback secret is prohibited in live deployment.'
  );
}

export default {
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
