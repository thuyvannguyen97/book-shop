require("dotenv").config();
var cloudinary = require("cloudinary").v2;

var User = require("../models/user.model");
var Book = require("../models/book.model");
var Transaction = require("../models/transaction.model");


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

//view shop
module.exports.index = async function(req, res) {
  var id = req.params.userId;
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  try {
    var user = await User.findById(id).exec();
    if(!user) {
      res.render('404');
      return;
    }
    var books = await Book.find({shopId: id}).exec();
    var numOfPages = Math.ceil(books.length / perPage);
    
    res.render("books/index", {
      shop: user,
      books: books.slice(start, end),
      currentPage: page,
      numOfPages: numOfPages
    });
  } catch (err) {
    res.render('500');
    console.error(err);
  }
};

//search
module.exports.search = async function(req, res) {
  var q = req.query.q;
  var id = req.params.userId;
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  try {
    var user = await User.findById(id).exec();
    if(!user) {
      res.render('404');
      return;
    }
    var books = await Book.find({shopId: id}).exec();
    var matchedList = books.filter(book => {
      return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    var numOfPages = Math.ceil(matchedList.length / perPage);
    
    res.render("books/index", {
      shop: user,
      books: matchedList.slice(start, end),
      currentPage: page,
      numOfPages: numOfPages,
      value: q
    });
  } catch (err) {
    res.render('500');
    console.error(err);
  }
};

//seller channel
module.exports.channel = async function(req, res) {
  var id = req.params.userId;
  try {
    var shop = await User.findById(id).exec();
    var books = await Book.find({shopId: id}).exec();
    res.render('shops/seller/index', {
      books: books,
      shop: shop
    });
  } catch(err) {
    console.error(err)
  }
}
//manage books
module.exports.manageBooks = async function(req, res) {
  var id = req.params.userId;
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  try {
    var user = await User.findById(id).exec();
    if(!user) {
      res.render('404');
      return;
    }
    var books = await Book.find({shopId: id}).exec();
    var numOfPages = Math.ceil(books.length / perPage);
    
    res.render("shops/seller/books/index", {
      shop: user,
      books: books.slice(start, end),
      currentPage: page,
      numOfPages: numOfPages
    });
  } catch (err) {
    res.render('500');
    console.error(err);
  }
};

//add a book
module.exports.addBook = function(req, res) {
  res.render("shops/seller/books/add");
};
module.exports.postAddBook = async function(req, res) {
  var userId = req.params.userId;
  const path = req.file.path;
  try {
    var shop = Book.find({userId: userId}).exec();
    if(shop) {
      req.body.userId = userId;
      req.body.coverUrl = await cloudinary.uploader
        .upload(path)
        .then(res => res.url);
      Book.create(req.body, function(err, small) {
        if (err) throw new Error('Cannot add book.');
      });
    }

  } catch (err) {
    console.log(err.message);
  }
  res.redirect("back");
};

//update a book
module.exports.updateBook = async function(req, res) {
  var id = req.params.id;
  try {
    var book = await Book.findById(id);
    res.render("shops/seller/books/update", {
      book: book
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.postUpdateBook = async function(req, res) {
  var path = req.file.path;
  var id = req.params.id;
  try {
    var coverUrl = await cloudinary.uploader.upload(path).then(res => res.url);
    await Book.findById(id, function(err, doc) {
      if(err) {throw new Error('Cannot find any book by the id.')}
      doc.title = req.body.title;
      doc.description = req.body.description;
      doc.coverUrl = coverUrl;
      doc.save();
    });
  } catch (err) {
    console.log(err.message);
  }
  res.redirect("back");
};

//delete a book
module.exports.deleteBook = async function(req, res) {
  var id = req.params.id;
  try {
    await Book.deleteOne({_id: id});
  } catch (err) {
    console.log(err);
  }
  
  res.redirect("/back");
};

//manage transactions
module.exports.manageTrans = async function(req, res) {
    var userId = req.params.userId;
    var currentPage = parseInt(req.query.page) || 1;
    var perPage = 10;
    var start = (currentPage - 1) * perPage;
    var end = currentPage * perPage;
    var trans = [];
    try {
      var transactions = await Transaction.find();
      var allTrans = await Promise.all(transactions.map(async tran => {
        var book = await Book.findById(tran.bookId);
        var shopId = book.shopId.toString();
        var user = await User.findById(tran.userId);
        return {
          id: tran.id,
          userName: user.name,
          bookTitle: book.title,
          shopId: shopId,
          isComplete: tran.isComplete
        };
      }));
      trans = allTrans.filter(tran => {return tran.shopId == userId});
      var numOfPages = Math.ceil(trans.length / perPage);
      res.render("shops/seller/transactions/index", {
        transactions: trans.slice(start, end),
        numOfPages: numOfPages,
        currentPage: currentPage
      });
    } catch (err) {
      console.log(err);
    }
};
module.exports.delete = async function(req, res) {
  var userId = req.params.userId;
  var id = req.params.id;
  try {
    await Transaction.deleteOne({_id: id});
  } catch(err) {
    console.log(err);
  }
  res.redirect("/shops/" + userId + "/portal/transactions");
};

module.exports.complete = async function(req, res) {
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