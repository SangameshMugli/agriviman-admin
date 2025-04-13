# AgriVimaan Admin-App

This is the admin dashboard for the AgriVimaan platform, designed to manage agricultural drone operations, contact requests, pilots, services, and orders.


# 1. Steps to Run the Project Locally

# Clone the repository
``` 
git clone https://github.com/SangameshMugli/agriviman-admin.git
cd agriviman-admin
```
# Install Frontend dependencies
```
npm install
```
# Start the Frontend  server
```
npm start
```

# 2 Database connection details/steps


# Navigate to the backend directory
```
cd agriviman-admin
cd backend
```

# Install backend dependencies
```
npm install
```
# Start the backend server
```
npm start
```

# Database Configuration

Create a .env file inside the backend directory and add the following:
```
PORT=5001
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=agrivimaan
JWT_SECRET=MY_SECRET_FOR_JSONWEBTOKEN
MYSQL_CONNECTION_LIMIT=10
```
-- Ensure MySQL is running and a database named agrivimaan is created.

# 3. List of technologies 

### Frontend
1.JavaScript
2.HTML
2.React.js
3.Tailwind CSS
4.Additional libraries (Axios,react-router)

### Backend
1.JavaScript 
2.Node.js
3.Express.js
4.MySQL (Relational Database)




