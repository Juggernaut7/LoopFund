const { signup, login } = require('../services/auth.service');

async function signupController(req, res, next) {
  try {
    const result = await signup(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function loginController(req, res, next) {
  try {
    const result = await login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { signup: signupController, login: loginController };