var Transaction = require("../models/transaction.model");
var User = require("../models/user.model");
var Book = require("../models/book.model");

module.exports = {
  index: async function(req, res) {
    var currentPage = parseInt(req.query.page) || 1;
    var perPage = 10;
    var start = (currentPage - 1) * perPage;
    var end = currentPage * perPage;
    var trans = [];
    var localUser = res.locals.user;
    try {
      var transactions = await Transaction.find();
      if (localUser.isAdmin) {
        trans = await Promise.all(transactions.map(async tran => {
          var book = await Book.findById(tran.bookId);
          var user = await User.findById(tran.userId);
          return {
            id: tran.id,
            userName: user.name,
            bookTitle: book.title,
            isComplete: tran.isComplete
          };
        }));
      } else {
        var userTrans = await Transaction.find({userId: localUser.id});
        trans = await Promise.all(userTrans.map(async tran => {
          var book = await Book.findById(tran.bookId);
          return {
            id: tran.id,
            bookTitle: book.title,
            isComplete: tran.isComplete
          };
        })); 
      }
      var numOfPages = Math.ceil(trans.length / perPage);
      res.render("transactions/index", {
        transactions: trans.slice(start, end),
        numOfPages: numOfPages,
        currentPage: currentPage
      });
    } catch (err) {
      console.log(err);
    }
  },
  create: async function(req, res) {
    try {
      var books = await Book.find();
      var users = await User.find();
      res.render("transactions/create", {
        books: books,
        users: users
      });
    } catch (err) {
      console.log(err);
    }
  },
  postCreate: function(req, res) {
    var transaction = {};
    transaction.userId = req.body.userId;
    transaction.bookId = req.body.bookId;
    transaction.isComplete = false;
    
    Transaction.create(transaction, function(err, small) {
      if(err) console.log(err);
    })
    res.redirect("/transactions");
  },
  delete: async function(req, res) {
    var id = req.params.id;
    try {
      await Transaction.deleteOne({_id: id});
    } catch(err) {
      console.log(err);
    }
    res.redirect("/transactions");
  },
  complete: async function(req, res) {
    var userId = req.params.userId;
    var id = req.params.id;
    try {
      await Transaction.findByIdAndUpdate(id, {isComplete: true});
    } catch(err) {
      res.redirect("/404");
      console.log(err);
    }
    res.redirect("/shops/" + userId + "/portal/transactions");
  }
};
