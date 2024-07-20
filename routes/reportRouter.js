const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {authenticateToken} = require('../middlewares/authen')

const Reports = require('../models/report');

const reportRouter = express.Router();
reportRouter.use(bodyParser.json());

reportRouter.get('/', (req, res, next) => {
  Reports.find({})
    .then((reports) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(reports);
    })
    .catch((err) => next(err));
});

reportRouter.post('/', authenticateToken, (req, res, next) => {
  console.log(req.user);
  const userId = req.user.id;
  const reportData = { ...req.body, userId };

  Reports.create(reportData)
    .then((report) => {
      console.log('Report Created ', report);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(report);
    })
    .catch((err) => next(err));
});

reportRouter.put('/', (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /reports');
});

reportRouter.delete('/', (req, res, next) => {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /reports');
});


reportRouter.get('/:reportId', (req, res, next) => {
  Reports.findById(req.params.reportId)
    .then((report) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(report);
    })
    .catch((err) => next(err));
});

reportRouter.put('/:reportId', (req, res, next) => {
  Reports.findByIdAndUpdate(req.params.reportId, {
    $set: req.body
  }, { new: true })
    .then((report) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(report);
    })
    .catch((err) => next(err));
});

reportRouter.delete('/:reportId', (req, res, next) => {
  Reports.findByIdAndDelete(req.params.reportId)
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    })
    .catch((err) => next(err));
});

module.exports = reportRouter;