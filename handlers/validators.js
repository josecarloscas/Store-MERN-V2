const { check, validationResult } = require('express-validator');

exports.signUpValidator = [
  check('name')
    .exists()
    .withMessage('El nombre es requerido.'),
  check('email')
    .exists()
    .withMessage('El correo es requerido.')
    .isEmail()
    .withMessage('Correo no valido.'),
  check('password')
    .exists()
    .withMessage('La contraseña es requerida.'),
];

exports.signInValidator = [
  check('email')
    .exists()
    .withMessage('El correo es requerido.')
    .isEmail()
    .withMessage('Correo no valido.'),
  check('password')
    .exists()
    .withMessage('La contraseña es requerida.'),
];

exports.addItemValidator = [
  check('itemId')
    .exists()
    .withMessage('itemId es requerido.'),
];

exports.removeItemValidator = [
  check('itemId')
    .exists()
    .withMessage('itemId es requerido.'),
  check('removeItem')
    .exists()
    .withMessage('removeItem es requerido.')
    .isBoolean()
    .withMessage('removeItem debe ser un valor de tipo bolean.'),
];

exports.getErrorsMessages = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return messages;
  }

  return null;
};
