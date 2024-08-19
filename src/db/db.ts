import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost', // Use MYSQLHOST from your environment
  user: process.env.MYSQLUSER || 'root',      // Use MYSQLUSER from your environment
  password: process.env.MYSQLPASSWORD || '',  // Use MYSQLPASSWORD from your environment
  database: process.env.MYSQLDATABASE || 'pointer', // Use MYSQLDATABASE from your environment
  port: parseInt(process.env.MYSQLPORT || '3306', 10), // Convert port to a number
});

export default pool;
