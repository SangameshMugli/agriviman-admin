const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const connection = require('../mysql/mysql');  

const username = 'Sangamesh';
const password = 'qweasdzxc';
const email = 'sangamesh@gmail.com';
const phoneNumber = 9876543210;

// Checking if the admin record is already  exists or not
const checkSql = 'SELECT * FROM admin WHERE user_name = ? OR email = ?';
connection.query(checkSql, [username, email], (err, results) => {
  if (err) {
    console.error('Error checking admin existence:', err);
    return;
  }

  if (results.length > 0) {
    console.log('Admin already exists, skipping insertion.');
    connection.end();
  } else {
    // Hashing the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        connection.end();
        return;
      }

      const insertSql = 'INSERT INTO admin (user_name, password, email, phone_number) VALUES (?, ?, ?, ?)';
      connection.query(insertSql, [username, hashedPassword, email, phoneNumber], (err, results) => {
        if (err) {
          console.error('Error inserting admin details:', err);
        } else {
          console.log('Admin details inserted successfully:', results);
        }
        connection.end();
      });
    });
  }
});

