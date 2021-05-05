const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { getErrorsMessages } = require('../handlers/validators');
const getDetailedItems = require('../helpers/getDetailedItems');

const User = require('../models/User');
const Item = require('../models/Item');

const signUp = async (req, res, next) => {
  if (getErrorsMessages(req)) {
    return res.status(422).json({ errors: getErrorsMessages(req) });
  }

  // Se crea un nuevo documento User para ser agregado a la DB.
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const displayedUser = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.json({
      message: 'Tu cuenta fue creada correctamente.',
      user: displayedUser,
    });
  } catch (err) {
    next(err);
  }
};

const signIn = (req, res, next) => {
  if (getErrorsMessages(req)) {
    return res.status(422).json({ errors: getErrorsMessages(req) });
  }

  const { email, password } = req.body;
  User.findOne({ email })
    .then(async user => {
      const isAuthenticated = await bcrypt.compare(password, user.password);
      if (isAuthenticated) {
        const displayedUser = {
          id: user._id,
          name: user.name,
          email: user.email,
        };
        const token = await jsonwebtoken.sign(
          displayedUser,
          process.env.JWT_SECRET || 'super secret key for local testing'
        );
        res.json({ token, name: user.name });
      } else {
        res.status(403).json({ error: 'El correo o la contraseña no son correctos.' });
      }
    })
    .catch(() =>
      res.status(403).json({ error: 'El correo o la contraseña no son correctos.' })
    );
};

const getCart = (req, res, next) => {
  const user = req.user;

  if (user) {
    User.findById(user.id)
      .then(async user => {
        const { detailedItems, totalPrice } = await getDetailedItems(
          user.items
        );

        res.json({ items: detailedItems, totalPrice });
      })
      .catch(error => res.status(500).json({ error }));
  }
};

const getCartItem = (req, res, next) => {
  const user = req.user;
  const { itemId } = req.params;

  if (user) {
    User.findById(user.id)
      .then(user => {
        let foundItem = user.items.filter(
          itemObject => itemObject.item == itemId
        )[0];

        if (foundItem) {
          Item.findById(foundItem.item)
            .then(item => {
              res.json({ item });
            })
            .catch(err => res.status(500).json({ err }));
        } else {
          res.json({ error: 'No existe un item con este ID.' });
        }
      })
      .catch(err => res.status(500).json({ err }));
  }
};

// Exportando...
exports.signUp = signUp;
exports.signIn = signIn;
exports.getCart = getCart;
exports.getCartItem = getCartItem;
