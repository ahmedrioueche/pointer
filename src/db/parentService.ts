import pool from "./db";

// Interface for parent data
export interface Parent {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    children_count?: number;
    subscription_type?: string;
    subscription_start_date?: Date;
    subscription_end_date?: Date;
    is_subscription_active?: boolean;
    payment_method?: string;
    last_payment_date?: Date;
    subscription_price?: number;
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
                parent.first_name,
                parent.last_name,
                parent.email,
                parent.password,
             
            ]
        );

        const parentId = (result as any).insertId; 

        await connection.commit();
        
        return parentId; // Return the ID of the newly inserted parent
    } catch (error) {
        await connection.rollback();
        throw error; // Re-throw the error to be handled by the caller
    } finally {
        connection.release();
    }
};

export const updateParent = async (parentId: number, updateData: Partial<Parent>): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        if(updateData) {
            const setClause = Object.keys(updateData)
            .map((key) => `${key} = ?`)
            .join(', ');
            const query = `UPDATE parent SET ${setClause} WHERE parent_id = ?`;
            const values = [...Object.values(updateData), parentId];
            console.log("updating parent table values:", values);
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

export async function getParentByEmail(email: string): Promise<any | null> {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT * FROM parent WHERE email = ?',
      [email]
    );

    await connection.commit();
    connection.release();

    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error retrieving user from database:', error);
    return null;
  }
}
