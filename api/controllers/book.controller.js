require("dotenv").config();
var cloudinary = require("cloudinary").v2;

var Book = require("../../models/book.model");

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
    var books = await Book.find();
    var numOfPages = Math.ceil(books.length / perPage);

    res.json({
      books: books.slice(start, end),
      currentPage: page,
      numOfPages: numOfPages
    });
  } catch (err) {
    console.log(err);
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

    res.json({
      books: matchedList,
      currentPage: page,
      numOfPages: numOfPages,
      value: q
    });
  } catch (err) {
    console.log(err);
  }
};

//add a book
module.exports.postAdd = async function(req, res) {
  const path = req.file.path;
  try {
    if (!path) {
      req.body.coverUrl =
        "https://arm256.com/jspui/image/default-cover-item.jpg";
    } else {
      req.body.coverUrl = await cloudinary.uploader
        .upload(path)
        .then(res => res.url);
    }
    var book = Book.create(req.body, function(err, small) {
      if (err) console.log(err);
    });
  } catch (err) {
    console.log(err);
  }
  res.json(book);
};

//update a book
module.exports.postUpdate = async function(req, res) {
  var path = req.file.path;
  var id = req.params.id;
  try {
    var coverUrl = await cloudinary.uploader.upload(path).then(res => res.url);
    var book = await Book.findById(id, function(err, doc) {
      doc.title = req.body.title;
      doc.description = req.body.description;
      doc.coverUrl = coverUrl;
      doc.save();
    });
  } catch (err) {
    console.log(err);
  }
  res.json(book);
};

//delete a book
module.exports.delete = async function(req, res) {
  var id = req.params.id;
  try {
    await Book.deleteOne({ _id: id });
  } catch (err) {
    console.log(err);
  }
};
