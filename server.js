require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(_ => console.log("MongoDB connected"))
  .catch(err => console.log("Cannot connect to MongoDB", err));

const app = express();

//routes
var welcomeRoute = require("./routes/welcome.route");
var bookRoute = require("./routes/book.route");
var userRoute = require("./routes/user.route");
var transRoute = require("./routes/transaction.route");
var authRoute = require("./routes/auth.route");
var cartRoute = require("./routes/cart.route");
var shopRoute = require("./routes/shop.route");

//api routes
var apiAuthRoute = require("./api/routes/auth.route");
var apiTransactionRoute = require("./api/routes/transaction.route");
var apiBookRoute = require("./api/routes/book.route");
var apiUserRoute = require("./api/routes/user.route");

// var cookieMiddleware = require('./middlewares/cookie.middleware');
var authMiddleware = require("./middlewares/auth.middleware");
var accountMiddleware = require("./middlewares/account.middleware");
var sessionMiddleware = require("./middlewares/session.middleware");

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(sessionMiddleware);
app.use(accountMiddleware.isAdmin);
app.use(accountMiddleware.isUser);

// use routes
app.use("/", welcomeRoute);
app.use("/books", bookRoute);
app.use("/users", authMiddleware.requireAuth, userRoute);
app.use("/transactions", authMiddleware.requireAuth, transRoute);
app.use("/auth", authRoute);
app.use("/cart", cartRoute);
app.use("/shops", shopRoute);

// use api routes
app.use("/api/auth", apiAuthRoute);
app.use("/api/transactions", apiTransactionRoute);
app.use("/api/books", apiBookRoute);
app.use("/api/users", apiUserRoute);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
