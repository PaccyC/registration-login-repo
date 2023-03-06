const User = require("../models/models");
const bcrypt = require("bcryptjs");
const async = require("hbs/lib/async");

const jwt = require("jsonwebtoken");

var tokens = [];

exports.logout = async (req, res, next) => {
  let restTokens = tokens.filter((token) => token !== req.Authorization.token);
  tokens = restTokens;
};
const maxAge=3 * 24 *  60 *60;
exports.register = async (req, res, next) => {
  const { username, email, password, confirm_password } = req.body;
  let errors = [];

  if (!username || !email || !password || !confirm_password) {
    
    errors.push({ msg: "please fill all fields" });
    res.json({ msg: "please fill all fields" });
  }
  if (password != confirm_password) {
    res.json({ msg: "passwords don't match" });
  }
  if (password.length < 5) {
    res.json({ msg: "password is too short" });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        res.send("User already exists");
      } else {
        const newUser = new User({
          email,
          password,
          username,
          confirm_password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            else {
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                const token = jwt.sign(
                    {
                      email: user.email,
                      userId: user._id,
                    },
                    'paccy secret',
                    {
                      expiresIn: maxAge,
                    }
                  );

                  res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge * 1000})
                  res.status(200).json({user:user._id});
                  
                  console.log(token);
                  tokens.push(token);
                  res.redirect("/");
                })
                .catch((err) => console.log(err));
            }
          });
        });
      }
    });
  }
};
exports.login =(req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.send("Please enter the password and email");
  }

  if (password.length == 0 || email.length == 0) {
    return res.status("email or password cannot be null");
  }
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(404);
      }
      bcrypt.compare(req.body.password, user.password, (err, isEqual) => {
        if (err) return res.status(401);
        if (isEqual) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            'paccy secret',
            {
              expiresIn: maxAge,
            }
          );
          res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge * 1000})
          tokens.push(token);
          return res.status(200).redirect("/profile/"+user._id);
        }
        res.status(401);
      });     
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send("We can't update data without body of request");
  }

  const id = req.params.id;
  console.log(id);
  User.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send("User not found");
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("An error occured while trying to update").status(500);
    });
};


exports.find = (req, res) => {
User.find()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => console.log(err));
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
  .then((data) => {
    if (!id) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  });
};