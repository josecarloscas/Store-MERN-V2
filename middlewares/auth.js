const jsonwebtoken = require('jsonwebtoken');
// Se establece la logica que permitirá el inicio de sesion y la carga de la lista de productos que tenga guardado el usuario mediante un JSONwebtoken
const loggedIn = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res
      .status(403)
      .json({ error: 'No cuentas con los permisos para acceder a esta ruta.' });
  }
  //Se verifica el token, en caso de fallo se dice que no cuenta con los permisos 
  try {
    const decoded = await jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET || 'super secret key for local testing'
    );
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res
        .status(403)
        .json({ error: 'No cuentas con los permisos para acceder a esta ruta.' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

//Se exporta el estado logeado
exports.loggedIn = loggedIn;
