const express=require('express');
const mongoose=require('mongoose');
const _=require('lodash');
const path=require('path')
const hbs=require('hbs')
const cookieParser=require('cookie-parser');
const app=express();

const {checkAuth,checkUser}=require('./authMiddleware/authMiddleware')

const dotenv=require('dotenv')
dotenv.config();
mongoose.connect('mongodb://127.0.0.1:27017/User',{useUnifiedTopology:true,useNewUrlParser:true})
.then(()=>{

    console.log('connected to db');
    app.listen(5000,()=>{
        console.log('app is running ...');
    })
})
.catch((err)=>console.log(err))

//view engine
app.set('view engine','hbs');

//middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());


const location=path.join(__dirname,"./public");
app.use(express.static(location))

const partialPath=path.join(__dirname,"./views/partials");
hbs.registerPartials(partialPath);


app.get('/set-cookies',(req,res)=>{
 res.cookie("paccy",false,{maxAge:2 * 24 * 60 *60 *60})
 res.send('cookies are set'); 
    
})
app.get('/read-cookies',(req,res)=>{
    const cookies=req.cookies;
    console.log(cookies);
    res.json(cookies);
})

app.get('/products',checkAuth,(req,res)=>{
    res.render('products');
})
const pages=require('./routes/pages');
app.use('/',pages)

const auth=require('./routes/auth')
app.use('/auth',auth)

