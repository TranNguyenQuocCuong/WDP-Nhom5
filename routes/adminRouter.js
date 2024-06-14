const express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/users");
const adminRouter = express.Router();
adminRouter.use(bodyParser.json());

const Coaches = require("../models/coaches");

adminRouter.route("/user")
  .get((req, res, next) => {
    Users.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(users);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Users.create(req.body)
      .then((user) => {
        console.log('User Created', user);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(user);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /user");
  });

//   .delete((req, res, next) => {
//     Users.remove({})
//       .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "text/html");
//         res.json(resp);
//       }, (err) => next(err))
//       .catch((err) => next(err));
//   });


adminRouter.route("/user/:userId")
  .get((req, res, next) => {
    Users.findById(req.params.userId) 
      .then((user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(user);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /users" +req.params.userId);
  })

  .put((req, res, next) => {
    Users.findByIdAndUpdate(req.params.userId, {
      $set: req.body
    }, {new: true})
    .then((user) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Users.findOneAndDelete(req.params.userId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

adminRouter.route("/coach")  
  .get((req, res, next) => {
    Coaches.find({})
      .then((coaches) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(coaches);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Coaches.create(req.body)
      .then((coach) => {
        console.log('Coach Created', coach);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(coach);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /coaches");
  });

//   .delete((req, res, next) => {
//     Coaches.remove({})
//       .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "text/html");
//         res.json(resp);
//       }, (err) => next(err))
//       .catch((err) => next(err));
//   });



adminRouter.route("/coach/:coachId")
  .get((req, res, next) => {
    Coaches.findById(req.params.coachId) 
      .then((coach) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(coach);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /coaches" +req.params.coachId);
  })

  .put((req, res, next) => {
    Coaches.findByIdAndUpdate(req.params.coachId, {
      $set: req.body
    }, {new: true})
    .then((coach) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.json(coach);
    }, (err) => next(err))
    .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Coaches.findOneAndDelete(req.params.coachId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


  
module.exports = adminRouter;
