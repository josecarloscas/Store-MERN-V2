const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema de los productos
const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    autoCreate: process.env.NODE_ENV !== 'production' ? true : false,
  }
);

itemSchema.post('findOne', (error, doc, next) => {
  if (error.name === 'CastError') {
    const customizedErr = new Error('Producto no encontrado.');
    customizedErr.name = error.name;
    customizedErr.code = 500;
    next(customizedErr);
  } else {
    next(error);
  }
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
