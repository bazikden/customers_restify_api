const errors = require('restify-errors')
const Customer = require('../models/Customers')

module.exports = app =>{
    // Get Customers
    app.get('/customers', async(req,res,next)=>{
        try{
            const customers = await Customer.find({})
            res.send(customers)
            next()
        }catch(err){
            return next(new errors.InvalidContentError(err))
        }

        
    })

    // Get Single Customer

    app.get('/customers/:id',async(req,res,next)=>{
        try {
            const customer = await Customer.findById(req.params.id)
            res.send(customer)
            next()
        } catch (error) {
            return next(new errors.ResourceNotFoundError(`There is not such customer with id ${req.params.id}`))
        }
    })

    // Add Customers

    app.post('/customers', async(req,res,next)=>{
        // Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expected 'application/json'"))
        }

        const{name, email, balance} = req.body

        const customer = new Customer({
            name,
            email,
            balance
        })

        try{
            const newCustomer = await customer.save()
            res.send(201)
            next()
        }catch(err){
            return next(new errors.InternalError(err.message))
        }
    })

    // Update customer
    
    app.put('/customers/:id',async(req,res,next)=>{
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expected application/json"))
        }
        try {
 
            const customer = await Customer.findOneAndUpdate({_id: req.params.id},req.body)
            res.send(200)
            next
        } catch (error) {
            return next( new errors.ResourceNotFoundError(`There is not such customer with id ${req.params.id}`))
        }
    })

    // Delete Customer

    app.del('/customers/:id',async(req,res,next)=>{
    
        try {
            const customer = await Customer.findOneAndRemove({_id:req.params.id})
            res.send(204)
            next()
        } catch (error) {
            return next(new errors.ResourceNotFoundError(`There is not such customer with id ${req.params.id}`))
        }
    })
}