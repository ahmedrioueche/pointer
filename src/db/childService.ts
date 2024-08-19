import pool from './db';

// Interface for child data
interface Child {
    parentId: number; 
    name: string;
    age: string;
    gender: string;
    hasDevice: string;
    usesSharedDevice?: string;
    username?: string; 
    password?: string;
    createdAt?: Date; 
}

// Function to insert a child into the database
export const insertChild = async (child: Child): Promise<number> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Insert the child record
        const [result] = await connection.query(
            `INSERT INTO child (
                parent_id, name, age, gender, has_device, uses_shared_device
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                child.parentId,
                child.name,
                child.age,
                child.gender,
                child.hasDevice,
                child.usesSharedDevice || null,
            ]
        );

        const childId = (result as any).insertId; // Get the auto-incremented ID

        await connection.commit();
        
        return childId; // Return the ID of the newly inserted child
    } catch (error) {
        await connection.rollback();
        throw error; // Re-throw the error to be handled by the caller
    } finally {
        connection.release();
    }
};
