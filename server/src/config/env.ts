import 'dotenv/config';

const required = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} not defined.`);
    }
    return value;
}

export const ENV = {
    PORT: required('PORT'),
    JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
    DATABASE_URL: required('DATABASE_URL'),
    NODE_ENV: required('NODE_ENV') || 'development',
    CLOUDINARY_CLOUD_NAME: required('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: required('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: required('CLOUDINARY_API_SECRET'),
}