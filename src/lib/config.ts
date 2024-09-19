import dotenv from 'dotenv';

dotenv.config();

export const getGeminiKey = () => process.env.GEMINI_KEY;