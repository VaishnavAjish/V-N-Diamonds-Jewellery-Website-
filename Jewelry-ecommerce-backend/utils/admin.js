const bcrypt = require('bcryptjs');
const admins = [
  {
    name: 'Superadmin',
    image: "https://i.ibb.co/wpjNftS/user-2.jpg",
    email: "superadmin@gmail.com",
    password: bcrypt.hashSync("Superadmin@2026"),
    phone: "123-456-7890",
    role: "Superadmin",
    status: "active",
    joiningData: new Date()
  }
];

module.exports = admins;
