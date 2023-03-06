
const express=require('express')
const router=express.Router();

const controller=require('../controllers/user');

router.post('/register',controller.register);

router.post('/',controller.login);

router.post('/update/:id',controller.update);

router.delete('/delete/:id',controller.delete);

router.get('/getUsers',controller.find);

module.exports=router