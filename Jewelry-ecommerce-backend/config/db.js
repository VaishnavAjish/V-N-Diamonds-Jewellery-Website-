const prisma = require('../prisma/client');

const connectDB = async () => {
  try { 
    await prisma.$connect();
    console.log('PostgreSQL connection success!');
  } catch (err) {
    console.log('PostgreSQL connection failed!', err.message);
  }
};

module.exports = connectDB;
