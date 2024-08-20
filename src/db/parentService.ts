import pool from "./db";

// Interface for parent data
export interface Parent {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_verified?: boolean;
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

interface Response {
    status: string;
    message?: string;
    parentId? : Number;
}
export const insertParent = async (parent: Parent): Promise<Response> => {
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

        return {
            status: 'success',
            parentId,
        };
    } catch (error) {
        await connection.rollback();

        // Type assertion to narrow the error type
        if (error instanceof Error && (error as any).code === 'ER_DUP_ENTRY') {
            return {
                status: 'failed',
                message: 'Email already exists',
            };
        }

        // If the error is not the expected type, rethrow it
        throw error;
    } finally {
        connection.release();
    }
};


export const updateParent = async (parentId: number, updateData: Partial<Parent>): Promise<Response> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        if (updateData && Object.keys(updateData).length > 0) {
            const setClause = Object.keys(updateData)
                .map((key) => `${key} = ?`)
                .join(', ');
            const query = `UPDATE parent SET ${setClause} WHERE parent_id = ?`;
            const values = [...Object.values(updateData), parentId];
            console.log("Updating parent table values:", values);

            await connection.query(query, values);
            await connection.commit();

            return { status: 'success' }; 
        } else {
            console.log("updateData is undefined or empty");
            return { status: 'failed', message: 'No data to update' }; 
        }
    } catch (error) {
        await connection.rollback();
        console.error('Error updating parent:', error);
        return { status: 'error', message: 'An error occurred' }; 
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
