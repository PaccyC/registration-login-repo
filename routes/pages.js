const express = require("express");



const router = express.Router();



const userController = require("../controllers/user");
const User = require("../models/models");
router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", userController.login);
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", userController.register);

router.get("/update/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("update", { user });
});
router.post("/update/:id", userController.update, (req, res) => {
  res.render("update");
});

router.get("/profile/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("profile", { user });
});

router.get('/home',(req,res)=>{
    res.render('home');
})



module.exports = router;
