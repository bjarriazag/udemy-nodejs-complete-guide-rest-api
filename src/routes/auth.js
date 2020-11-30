const express = require('express');
const { body } = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(String('E-Mail address already exists!'));
          }
          return Promise.resolve(true);
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  authController.updateUserStatus
);

module.exports = router;
