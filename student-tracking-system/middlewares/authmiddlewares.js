const jwt=require('jsonwebtoken')

const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt

    if (token) {
        jwt.verify(token,'gizli kelime',(err,decodedToken)=>{
            if (err) {
                console.log(err)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
        
    }else{
        res.redirect('/login')
    }
}


module.exports={requireAuth}