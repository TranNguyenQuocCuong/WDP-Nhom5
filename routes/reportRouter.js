const express = require("express");
const bodyParser = require("body-parser");
const Reports = require("../models/report");

const reportRouter = express.Router();
reportRouter.use(bodyParser.json());

reportRouter.route("/")
.get((req, res, next) => {
    Reports.find({})
      .then((reports) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(reports);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = reportRouter;
