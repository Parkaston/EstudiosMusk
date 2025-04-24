const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const mockUser = {
  username: 'admin',
  password: 'admin123'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === mockUser.username && password === mockUser.password) {
    const token = jwt.sign({ username }, 'secreto123', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

module.exports = router;