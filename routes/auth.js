const bcrypt = require('bcryptjs'),
      mongoose = require('mongoose'),
      User = mongoose.model('User')  

 exports.authenticate = (email,password) =>{
     return new Promise(async(resolve,reject)=>{
            try {
                //Get User By Email
                const user = await User.findOne({email})

                //Match Password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err
                    if(isMatch){
                        resolve(user)
                    }else{
                        //Pass didn`t match
                        reject('Authentication Failed')
                    }
                })
            } catch (err) {
                //Email not found
                reject("Authentication Failed")
            }
     })
 }      