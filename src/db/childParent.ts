import pool from './db';

// Interface for child data
interface Child {
    userId: number;
}

// Function to insert a child into the database
export const insertChild = async (child: Child): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const [result] = await connection.query(
            `INSERT INTO child (user_id) VALUES (?)`,
            [child.userId]
        );

        // Optionally handle the result if needed (e.g., logging or returning the inserted ID)

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error; // Re-throw the error to be handled by the caller
    } finally {
        connection.release();
    }
};
