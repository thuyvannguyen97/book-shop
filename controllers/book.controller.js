require("dotenv").config();
var cloudinary = require("cloudinary").v2;

var Book = require("../models/book.model");
var User = require("../models/user.model");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.index = async function(req, res) {
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  try {
    // var a; a.b();
    var books = await Book.find();
    var numOfPages = Math.ceil(books.length / perPage);
    
    res.render("books/index", {
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
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;
  var start = (page - 1) * perPage;
  var end = page * perPage;

  var q = req.query.q;
  try {
    var books = await Book.find();
    var matchedList = books.filter(book => {
      return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });

    var numOfPages = Math.ceil(matchedList.length / perPage);

    res.render("books/index", {
      books: matchedList,
      currentPage: page,
      numOfPages: numOfPages,
      value: q
    });
  } catch (err) {
    res.render('500');
    console.error(err);
  }
};

//add a book
module.exports.add = function(req, res) {
  res.render("books/add");
};
module.exports.postAdd = async function(req, res) {
  const path = req.file.path;
  if(!path) {
    path = "https://cdn.glitch.com/b5afea55-2ff2-49ba-be5d-73e2b1ac3b55%2Fapple-icon-60x60.png?v=1598791527457";
  }
  try {
    req.body.coverUrl = await cloudinary.uploader
      .upload(path)
      .then(res => res.url);
    Book.create(req.body, function(err, small) {
      if (err) throw new Error('Cannot create book.');
    });
  } catch (err) {
    console.log(err.message);
  }
  res.redirect("/books");
};

//update a book
module.exports.update = async function(req, res) {
  var id = req.params.id;
  try {
    var book = await Book.findById(id);
    res.render("books/update", {
      book: book
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.postUpdate = async function(req, res) {
  var path = req.file.path;
  if(!path) {
    path = "https://cdn.glitch.com/b5afea55-2ff2-49ba-be5d-73e2b1ac3b55%2Fapple-icon-60x60.png?v=1598791527457";
  }
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
  res.redirect("/books");
};

//delete a book
module.exports.delete = async function(req, res) {
  var id = req.params.id;
  try {
    await Book.deleteOne({_id: id});
  } catch (err) {
    console.log(err);
  }
  
  res.redirect("/books");
};

module.exports.detail = async function(req, res) {
  var id = req.params.id;
  var book = await Book.findById(id).exec();
  var shop = await User.findById(book.shopId).exec();
  res.render('books/detail', {
    book: book,
    shop: shop
  })
}