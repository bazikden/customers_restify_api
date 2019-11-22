const errors = require('restify-errors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/User')
const auth = require('./auth')

module.exports = app => {
    //Register User
    app.post('/register',(req,res,next)=>{
        const {email,password} = req.body

        const user = new User({
            email,
            password
        })
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,async(err,hash)=>{
                // Hash Password
                user.password = hash

                // Save User
                try {
                    const newUser = await user.save()
                    res.send(201)
                    next()
                } catch (err) {
                    return next(new errors.InternalError(err.message))
                    
                }
            })
        })
    })

    //Auth user
    app.post('/auth',async(req,res,next)=>{
        const{email,password} = req.body
 
        try {
            //Authentificate User
            const user = await auth.authenticate(email,password)

            //Create JWT
            const token = jwt.sign(user.toJSON(),config.JWT_SECRET,{expiresIn:'15m'})
            const {iat,exp} = jwt.decode(token)
            
            //Respond with token
            res.send({iat,exp,token})
            next()
            
        } catch (error) {
            return next(new errors.UnauthorizedError(error)           )
        }
    })
}
