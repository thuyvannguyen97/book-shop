const Session = require("../models/session.model.js");

module.exports = async (req, res, next) => {
  try {
    if (!req.signedCookies.sessionId) {
      await Session.deleteMany();
      let newSession = await Session.create({});
      res.cookie("sessionId", newSession.id, {
        signed: true
      });
    }
    // console.log(req.signedCookies.sessionId)
    let session = await Session.findById(req.signedCookies.sessionId);
    // console.log(session)

    let countCart = 0;
    if (session) {
      for (let book of session.cart) {
        countCart += book.quantity;
      }
    }

    res.locals.countCart = countCart;
    res.locals.cart = session.cart;
    } catch(err) {
      console.log(err);
    }
  next();
};
