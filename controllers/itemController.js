const { getErrorsMessages } = require('../handlers/validators');
const getDetailedItems = require('../helpers/getDetailedItems');

const Item = require('../models/Item');
const User = require('../models/User');

const getAllItems = (req, res, next) => {
  Item.find()
    .then(items => {
      res.json({ items });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

const addItem = (req, res, next) => {
  if (getErrorsMessages(req)) {
    return res.status(422).json({ errors: getErrorsMessages(req) });
  }

  const { itemId } = req.body;
  const user = req.user;

  if (user) {
    Item.findById(itemId)
      .then(() => {
        User.findById(user.id)
          .then(async user => {
            let foundItemIndex = user.items.findIndex(
              itemObject => itemObject.item == itemId
            );

            // Se comprueba si el articulo se encuentra en el array.
            // Si lo esta se incrementa la cantidad de este. Caso contrario se agrega al array.
            if (foundItemIndex > -1) {
              user.items[foundItemIndex].quantity += 1;
              user.save();
            } else {
              user.items.push({ item: itemId, quantity: 1 });
              user.save();
            }

            const { detailedItems, totalPrice } = await getDetailedItems(
              user.items
            );
            res.json({ userItems: detailedItems, totalPrice });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => next(error));
  }
};

const removeItem = (req, res, next) => {
  if (getErrorsMessages(req)) {
    return res.status(422).json({ errors: getErrorsMessages(req) });
  }

  const { itemId, removeItem } = req.body;
  const user = req.user;
  if (user) {
    Item.findById(itemId)
      .then(() => {
        User.findById(user.id)
          .then(async user => {
            let foundItemIndex = user.items.findIndex(
              itemObject => itemObject.item == itemId
            );

            if (foundItemIndex > -1) {
              // Caso en el que el articulo desea ser eliminado
              if (removeItem) {
                user.items.splice(foundItemIndex, 1);
                user.save();
              } else {
                let { quantity } = user.items[foundItemIndex];

                if (quantity > 1) {
                  quantity--;
                  user.items[foundItemIndex].quantity = quantity;
                } else {
                  user.items.splice(foundItemIndex, 1);
                }

                user.save();
              }

              const { detailedItems, totalPrice } = await getDetailedItems(
                user.items
              );
              res.json({ userItems: detailedItems, totalPrice });
            } else {
              res.status(422).json({ error: 'No se encontro el articulo.' });
            }
          })
          .catch(error => res.json({ error }));
      })
      .catch(error => next(error));
  }
};

// Exportando...
exports.getAllItems = getAllItems;
exports.addItem = addItem;
exports.removeItem = removeItem;
