import pool from './db';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';
import type { User } from 'next-auth';

// Define the User type that fits NextAuth expectations
interface DBUser extends RowDataPacket {
    id: string;
    email: string;
    name?: string;
    image?: string;
    password: string;
    
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
    try {
        const connection = await pool.getConnection();
        
        try {
            const [rows] = await connection.execute<DBUser[]>(
                'SELECT * FROM parent WHERE email = ?',
                [email]
            );

            if (rows.length > 0) {
                const user = rows[0];

                const isPasswordMatch = await bcrypt.compare(password, user.password);

                if (isPasswordMatch) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                    };
                }
            }

            return null; 
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error retrieving user from database:', error);
        return null;
    }
}

