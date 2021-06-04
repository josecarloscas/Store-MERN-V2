const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { getErrorsMessages } = require('../handlers/validators');
const getDetailedItems = require('../helpers/getDetailedItems');

const User = require('../models/User');
const Item = require('../models/Item');

const addItemdb = async (req, res, next) => {
  if (getErrorsMessages(req)) {
    return res.status(422).json({ errors: getErrorsMessages(req) });
  }

  // Se crea un nuevo documento Item para ser agregado a la DB.
  const { name, description, price, imageUrl } = req.body;
  try {

    const item = await Item.create({
      name,
      description,
      price,
      imageUrl,
    });

    const displayedItem = {
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
    };

    res.json({
      message: 'El producto fue añadido correctamente.',
      item: displayedItem,
    });
  } catch (err) {
    next(err);
  }
};

// Exportando...
exports.addItemdb = addItemdb;
