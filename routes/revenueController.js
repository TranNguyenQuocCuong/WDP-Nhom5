const express = require('express');
const Revenue = require('../models/revenue');

const revenueRouter = express.Router();

revenueRouter.route('/')
    .get((req, res, next) => {
        Revenue.find({})
            .populate('planId')
            .populate('userId')
            .then((revenues) => {
                res.status(200).json(revenues);
            })
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Revenue.create(req.body)
            .then((revenue) => {
                console.log('Revenue Created', revenue);
                res.status(200).json(revenue); // Changed statusCode to 200 and used json method
            })
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.status(403).send('PUT operation not supported on /revenues');
    });

revenueRouter.route('/:id')
    .get((req, res, next) => {
        Revenue.findById(req.params.id)
            .populate('planId')
            .populate('userId')
            .then((revenue) => {
                if (revenue) {
                    res.status(200).json(revenue);
                } else {
                    res.status(404).send('Revenue not found');
                }
            })
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        Revenue.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
            .then((revenue) => {
                if (revenue) {
                    res.status(200).json(revenue);
                } else {
                    res.status(404).send('Revenue not found');
                }
            })
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Revenue.findByIdAndDelete(req.params.id)
            .then((revenue) => {
                if (revenue) {
                    res.status(200).json({
                        status: 'Revenue deleted successfully',
                        revenue: revenue
                    });
                } else {
                    res.status(404).send('Revenue not found');
                }
            })
            .catch((err) => next(err));
    });


module.exports = revenueRouter;
