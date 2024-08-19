import pool from "./db";

// Interface for parent data
interface Parent {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    childrenCount?: number;
    subscriptionType?: string;
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    isSubscriptionActive?: boolean;
    paymentMethod?: string;
    lastPaymentDate?: Date;
    subscriptionPrice?: number;
}

// Function to insert a parent into the database
export const insertParent = async (parent: Parent): Promise<number> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const [result] = await connection.query(
            `INSERT INTO parent (
                first_name, last_name, email, password
            ) VALUES (?, ?, ?, ?)`,
            [
                parent.firstName,
                parent.lastName,
                parent.email,
                parent.password,
             
            ]
        );

        const parentId = (result as any).insertId; // Get the auto-incremented ID

        await connection.commit();
        
        return parentId; // Return the ID of the newly inserted parent
    } catch (error) {
        await connection.rollback();
        throw error; // Re-throw the error to be handled by the caller
    } finally {
        connection.release();
    }
};

// Function to update additional parent information
export const updateParent = async (parentId: number, updateData: Partial<Parent>): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        if(updateData) {
            // Build the SQL query dynamically based on provided fields
            const setClause = Object.keys(updateData)
            .map((key) => `${key} = ?`)
            .join(', ');
            const query = `UPDATE parent SET ${setClause} WHERE parent_id = ?`;
            const values = [...Object.values(updateData), parentId];

            await connection.query(query, values);

            await connection.commit();
        }
        else
            console.log("updateData is undefined")
       
    } catch (error) {
        await connection.rollback();
        throw error; // Re-throw the error to be handled by the caller
    } finally {
        connection.release();
    }
};
