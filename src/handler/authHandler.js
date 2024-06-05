const { Router } = require('express');
const bcrypt = require('bcrypt');
const { login } = require('../repositories/authRepositories');
const AuthenticationError = require('../exceptions/AuthenticationError');
const jwt = require('jsonwebtoken');

const authHandler = Router();

authHandler.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login(email);
    const match = await bcrypt.compare(password, result.password);

    if (!match) {
      throw new AuthenticationError('Invalid username or password');
    }

    const token = jwt.sign({
      id: result.user_id,
    }, 's3h4rusny4(1n1)s3cr3t[k3y]t4p1{b1ngung}k4t4_k4t4ny4', { expiresIn: '1h' });

    res.status(200).json({
      message: 'Created',
      data: {
        id: result.user_id,
        name: result.name,
        email: result.email,
        image_url: result.image_url,
        token
      },
    });
  } catch (error) {
    next(error)
  }
});

module.exports = authHandler;