const dotenv = require('dotenv');
//Used to export and allow other files to use the environmental variables.
dotenv.config();
module.exports = {
  user_name: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
};
