const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3001;
// Middleware to parse JSON body
app.use(express.json());
// Simulated user data (replace with your database or storage mechanism)
const users = [
 { id: 1, username: 'user1', password: 'password1', role: 'user' },
 { id: 2, username: 'admin', password: "password2", role: 'admin' }
];
// Authenticate user
app.post('/login', (req, res) => {
 const { username, password } = req.body;
 // Find user by username
 const user = users.find((user) => user.username === username);
if (!user) {
 return res.status(401).json({ message: 'Invalid username ' });
 }
//  Check password
//  if (!bcrypt.compareSync(password, user.password)) {
//  return res.status(401).json({ message: 'Invalid username or password' });
//  }
 // Generate JWT token
 const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secretkey');
 // Send token in response
 res.json({ token });
});
// Protected route that requires authentication and authorization
app.get('/protected', authenticateToken, (req, res) => {
 res.json({ message: 'Protected route accessed successfully' });
});
// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
 const token = authHeader && authHeader.split(' ')[1];
 if (!token) {
 return res.sendStatus(401);
 }
 jwt.verify(token, 'secretkey', (err, user) => {
 if (err) {
 return res.sendStatus(403);
 }
 req.user = user;
 next();
 });
}
// Start the server
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
