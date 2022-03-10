const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("user")
module.exports = (req,res,next)=>{
    const {authorization} = req.headers
  // console.log(authorization.split(' ')[1]);
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.split(' ')[1];
  jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload
       // console.log(_id)
        User.findById(_id).then(userdata=>{
            req.user = userdata
            //console.log(userdata);
            //res.json(payload.email)
            next()
        })
        
        
    })
    /*jwt.verify(token,  JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            console.log(user);
            next();
        });
    //var dec=*/
}


/*const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            CONSOLE.LOG(user);
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
module.exports=authenticateJWT();*/