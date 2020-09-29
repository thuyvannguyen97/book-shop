var Book = require('../models/book.model');

module.exports = {
  index: async (request, response) => {
    try {
      var books = await Book.find();
      response.render('index', {
        books: books
      });
    } catch(err) {
      console.error(err)
    }
  },
  search: async function(req, res) {
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

      res.render("index", {
        books: matchedList,
        currentPage: page,
        numOfPages: numOfPages,
        value: q
      });
    } catch (err) {
      res.render('500');
      console.error(err);
    }
  }
}