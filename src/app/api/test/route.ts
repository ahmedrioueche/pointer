import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'pointer',
    password: 'betterdays2023' // Change to your MySQL password
});

// Define the API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            // Query the database for the user
            const [rows] = await pool.query('SELECT * FROM parent WHERE email = ?', [email]);
            const user = (rows as mysql.RowDataPacket[])[0];

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }

            // Compare the provided password with the stored hash
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({ success: false, message: 'Incorrect password.' });
            }

            // Exclude password from user data
            const { password: _, ...userData } = user;
            res.status(200).json({ success: true, data: userData });
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ success: false, message: 'An error occurred during login.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
