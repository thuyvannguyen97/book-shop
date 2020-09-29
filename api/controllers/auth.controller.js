require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const bcrypt = require('bcrypt');

var User = require('../../models/user.model');

module.exports = {
  postLogin: async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    try {
      var user = await User.findOne({email: email});
      if(!user) {
        res.json(["User does not exist."]);
        return;
      };
      if (!user.wrongLoginCount) {
        await User.findByIdAndUpdate(user.id, {
          wrongLoginCount: 0
        });
      }
      if(user.wrongLoginCount >= 3) {
        const msg = {
          to: user.email,
          from: 'vanmiu170797@gmail.com',
          subject: 'Login Library',
          text: 'you have exeeded the maximum number of login attempts. Your account is locked now.',
          html: '<strong>You have exeeded the maximum number of login attempts. Your account is locked now.</strong>',
        };
        sgMail.send(msg);
        res.json({
          errors: ["you have exeeded the maximum number of login attempts. Your account is locked now."],
          values: req.body
        });
        return;
      }
      const match = await bcrypt.compare(password, user.password);
      if(!match) {
        user.wrongLoginCount++;
        user.save()
        return;
      }
      res.status(200).json({
        message: "You have successfully logged in",
        user: user
      });
      await User.findOneAndUpdate({email: email}, {wrongLoginCount: 0});
      
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  }
}