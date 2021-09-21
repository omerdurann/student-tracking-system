const User =require('../models/users')
const jwt=require('jsonwebtoken')

const maxAge=60*60*24

const createtoken=(id)=>{
   return jwt.sign({id},'gizli kelime',{expiresIn:maxAge})
}


const login_get=(req,res)=>{
    res.render("login",{layout: false})
}

const login_post= async(req,res)=>{
    const {username,password}=req.body
    try{
        const user =await User.giris(username,password)
        console.log(user._id)
        const token= createtoken(user._id)
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000}) 
        res.redirect('/index')
    }
    catch(e){
        console.log(e)
    }
}

const singup_get=(req,res)=>{
    res.render("signup",{layout: false})
}

const singup_post=(req,res)=>{
    const user = new User(req.body)
    user.save()
    .then((result)=>{
        res.redirect('/login')
    })
    .catch((err)=>{
        console.log(err)
    })

}


const logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('login')
}

module.exports={
    login_get,
    login_post,
    singup_get,
    singup_post,
    logout_get
}