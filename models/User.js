const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema User
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  items: [
    {
      item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
      },
      quantity: {
        type: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    const customizedErr = new Error('Ingrese un email diferente.');
    customizedErr.name = error.name;
    customizedErr.code = 500;
    next(customizedErr);
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
