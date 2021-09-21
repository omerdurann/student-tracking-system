
const mongoose = require('mongoose');
//const bcrypt=require('bcrypt')

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})



userSchema.statics.giris= async function(username,password) { 
    const user=await this.findOne({username})
    console.log(user)
    if (user) {
        const auth =await bcrypt.compare(password,user.password)
        if (auth) {
            return user            
        }else{
            throw Error('Parola Hatali')
        }
    }else{
        throw Error('kullanici Bulunamadı')
    }
}

userSchema.pre('save',async function(next){
    const salt= await bcrypt.genSalt()
    this.password=await bcrypt.hash(this.password,salt)
    next()
})

const user =new mongoose.model('user',userSchema)
module.exports=user