
  import mysql from 'mysql2/promise';

  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'pointer',
    port: 3306,
  });

  export default pool;
