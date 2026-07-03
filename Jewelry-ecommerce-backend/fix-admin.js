const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`UPDATE "Admin" SET name='Superadmin', email='superadmin@gmail.com' WHERE email='Superadmin' OR name='superadmin@gmail.com'`);
    console.log("Admin updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
