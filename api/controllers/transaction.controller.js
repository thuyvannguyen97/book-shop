var Transaction = require("../../models/transaction.model");
var User = require("../../models/user.model");
var Book = require("../../models/book.model");

module.exports = {
  index: async function(req, res) {
    var currentPage = parseInt(req.query.page);
    if (isNaN(currentPage) || currentPage < 1) {
      currentPage = 1;
    }
    var perPage = 10;
    var start = (currentPage - 1) * perPage;
    var end = currentPage * perPage;
    var trans = [];
    var localUser = res.locals.user;
    try {
      var transactions = await Transaction.find();
      var books = await Book.find();
      var users = await User.find();
        trans = transactions.map(tran => {
          var book = books.find(book => {
            return book._id == tran.bookId;
          });
          var user = users.find(user => {
            return user._id == tran.userId;
          });
          return {
            id: tran._id,
            userName: user.name,
            bookTitle: book.title,
            isComplete: tran.isComplete
          };
        });
      var numOfPages = Math.ceil(trans.length / perPage);
      res.status(200).json({
        transactions: trans.slice(start, end),
        numOfPages: numOfPages,
        currentPage: currentPage
      });
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({
        errors: ["Could not retrieve data"]
      });
    }
  },
  postCreate: function(req, res) {
    var transaction = {};
    transaction.userId = req.body.userId;
    transaction.bookId = req.body.bookId;
    transaction.isComplete = false;

    Transaction.create(transaction, function(err, small) {
      if (err) console.error(err);
      res.statusCode = 500;
      return res.json({
        errors: ["Failed to create transaction"]
      });
    });
    res.statusCode = 201;
    res.json(transaction);
  },
  delete: async function(req, res) {
    var id = req.params.id;
    try {
      if (!id) throw new Error("Not found");
      const transaction = await Transaction.deleteOne({ id: id });
      return res
        .status(200)
        .json({ message: "Delete successfully" })
        .end();
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  complete: async function(req, res) {
    var id = req.params.id;
    try {
      var tran = await Transaction.findById(id);
      tran.isComplete = true;
      tran.save;
      res.status(200).json({ transaction: tran });
      
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  }
};
