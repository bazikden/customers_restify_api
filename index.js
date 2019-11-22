const restify = require('restify')
const mongoose = require('mongoose')
const config = require('./config')
const rjwt = require('restify-jwt-community')
const app = restify.createServer()

// midleware

app.use(restify.plugins.bodyParser())

// Protect Routes
//app.use(rjwt({secret:config.JWT_SECRET}).unless({path:['/auth'] }))

app.listen(config.PORT,() =>{
    mongoose.connect(config.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
})

const db = mongoose.connection

db.on('error',(err)=>{console.log(err)})

db.once('open',()=>{
    require('./routes/customers')(app)
    require('./routes/users')(app)
    console.log(`Server started on port ${config.PORT}`)
})