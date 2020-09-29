const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  bookId: { type: Schema.Types.ObjectId, ref: "Book" },
  isComplete: Boolean,
});

var Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');
module.exports = Transaction;