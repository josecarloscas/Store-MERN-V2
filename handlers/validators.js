const { check, validationResult } = require('express-validator');

//Se define el manejo de los eventos para el registro
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

//Se define el manejo de los eventos para el el inicio de sesión
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

//Se define el manejo de los eventos para agregar los productos al carro
exports.addItemValidator = [
  check('itemId')
    .exists()
    .withMessage('itemId es requerido.'),
];

//Se define el manejo de los eventos para eliminar los productos del carro
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

//Se define el manejo de los eventos para los mensajes de error
exports.getErrorsMessages = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return messages;
  }

  return null;
};
