const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: String,
  description: String,
  coverUrl: String,
  shopId: { type: Schema.Types.ObjectId, ref: "User" }
});

var Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;