const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to DB!");
    
    // Insert Admin
    const adminQuery = `
      INSERT INTO "Admin" (id, name, email, image, phone, status, password, role, "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (email) DO UPDATE SET name = $2;
    `;
    
    // The password is 'Superadmin@2026' hashed with bcrypt.
    // I will just use the hash from utils/admin.js
    const adminData = require('./utils/admin')[0];
    
    await client.query(adminQuery, [
      adminData._id || 'admin-1234',
      'Superadmin',
      'superadmin@gmail.com',
      adminData.image,
      adminData.phone,
      adminData.status,
      adminData.password,
      adminData.role
    ]);
    
    console.log("Admin inserted!");
    
    // Insert users, products, etc. if needed, but Admin is the most critical for login!
    
    await client.end();
  } catch (e) {
    console.error(e);
  }
}

run();
