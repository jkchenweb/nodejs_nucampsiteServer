const express = require('express');
const promotionRouter = express.Router();
const Promotion = require('../models/promotion');
const cors = require('./cors');
const authenticate = require('../authenticate');

promotionRouter.route('/')

.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
})

.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.get(cors.cors, (req, res, next) => {
    Promotion.find()
    .then(promotions=>{
        res.json(promotions);
    }).catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Promotion.create(req.body)
   .then(promotion => {
       console.log('Promotion Created', promotion);
       res.json(promotion);
   }).catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.deleteMany()
    .then(response=>{
        res.json(response);
    }).catch(err => next(err));
});

promotionRouter.route('/:promotionId')

.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    //maybe we should check the type of req.params.promotionId
    next();
})

.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.get(cors.cors, (req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion=>{
        res.json(promotion);
    }).catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    },{
        new: true
    })
    .then(promotion=>{
        res.json(promotion);
    })
    .catch(err => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response=>{
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = promotionRouter;