var shortid = require("shortid");
var Book = require("../models/book.model");
var Session = require("../models/session.model");
var Transaction = require('../models/transaction.model');

module.exports.index = async function(req, res) {
  var cart = res.locals.cart;
  try {
    var books = await Book.find().exec();
    var booksInCart = await Promise.all(cart.map(async item => {
      var bookInCart = await Book.findById(item.bookId).exec();
      return {id: bookInCart.id, title: bookInCart.title, coverUrl: bookInCart.coverUrl, quantity: item.quantity};
    }));
  } catch (err) {
    console.log(err);
  }
  res.render("cart/index", {
    books: booksInCart
  });
};

//add to cart
module.exports.addToCart = async function(req, res) {
  var bookId = req.params.bookId;
  var sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    res.redirect("/books");
    return;
  }
  try {
    var session = await Session.findById(sessionId).exec();
    if(session) {
      var book = session.cart.find(
        cartItem => cartItem.bookId.toString() === bookId
      );
      if (book) {
        book.quantity += 1;
        session.save();
      } else {
        // session.cart.push({bookId: bookId, quantity: 1});
        // session.save();  
        await Session.findByIdAndUpdate(sessionId, {
          $push: { cart: { bookId: bookId, quantity: 1 } }
        });
      }
    }

  } catch (err) {
    console.log(err);
  }
  res.redirect("/books");
};

//remove item from cart
module.exports.delete = async function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  var bookId = req.params.bookId;

  var session =  await Session.findById(sessionId).exec();
  var newCart = []
  for (var item of session.cart) {
    if(item.bookId.toString() !== bookId) {
      newCart.push(item);
    }
  }
  session.cart = newCart;
  session.save();

  res.redirect("/cart");
};

//checkout
module.exports.checkout = async function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  req.body.userId = req.signedCookies.userId;
  try {
    var session = await Session.findById(sessionId);
    for (var item of session.cart) {
      req.body.isCompleted = false;
      req.body.bookId = item.bookId;

      Transaction.create(req.body, function(err, small) {
        if (err) console.log(err);
      });
      //delete cart
      session.cart = [];
      session.save();
    }
  } catch(err) {
    console.log(err)
  }
  res.redirect("/transactions");
};
