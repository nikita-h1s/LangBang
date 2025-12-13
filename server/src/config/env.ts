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
    JWT_SECRET: required('JWT_SECRET'),
    DATABASE_URL: required('DATABASE_URL')
}