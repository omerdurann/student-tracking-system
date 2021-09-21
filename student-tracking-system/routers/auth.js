const router =require('express')
const authcontrollers=require('../controllers/authcontrollers')

exports.auth=router.Router();

exports.auth.get('/login',authcontrollers.login_get)
exports.auth.post('/login',authcontrollers.login_post)
exports.auth.get('/signup',authcontrollers.singup_get )
exports.auth.post('/signup',authcontrollers.singup_post )
exports.auth.get('/logout',authcontrollers.logout_get)    
