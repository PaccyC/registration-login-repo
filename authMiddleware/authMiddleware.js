

const jwt=require('jsonwebtoken');

const checkAuth=(req,res,next)=>{

    const token=req.cookies.jwt
    if(token){
        jwt.verify(token,'paccy secret',(err,decodedToken)=>{
            if(err){
                res.redirect('/');
            }
            else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/');
    }
}
const checkUser=(req,res,next)=>{
    const token=req.cookies.jwt

    if(token){
 jwt.verify(token,'Hitler was a powerful man',async(err,decodedToken)=>{
    if(err){
        res.locals.user=null
        console.log(err.message);
        next();
    }
    else{
        console.log(decodedToken);
        const user=await User.findById(decodedToken.id);
        res.locals.user=user
        next();
    }
})
}
else{
    res.locals.user=null
    next();
}
}
module.exports={checkAuth,checkUser};

