const Item = require('../models/Item');
// Se define la logica que permite el calculo total de la compra dependiento de la cantidad de los productos del carro,
// Siendo esta cantidad la que define el precio por cada producto en la lista 
module.exports = async items => {
  let detailedItems = [];
  let totalPrice = 0;

  for (const itemObject of items) {
    await Item.findById(itemObject.item).then(item => {
      totalPrice += itemObject.quantity * item.price;
      detailedItems.push({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: itemObject.quantity,
      });
    });
  }

  return {
    detailedItems,
    totalPrice,
  };
};
