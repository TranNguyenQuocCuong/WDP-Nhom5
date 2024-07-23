// routes/advice.js
const express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/users");
const blogRouter = express.Router();
blogRouter.use(bodyParser.json());
const Blogs = require("../models/blog");
const { authenticateToken } = require('../middlewares/authen');

// Route để huấn luyện viên gửi lời khuyên cho người dùng
blogRouter.route("/")
  .get((req, res, next) => {
    Blogs.find({})
      .then((blogs) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(blogs);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Blogs.create(req.body)
      .then((blog) => {
        console.log('Blog Created', blog);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(blog);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /blogs");
  });

//   .delete((req, res, next) => {
//     Blogs.remove({})
//       .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "text/html");
//         res.json(resp);
//       }, (err) => next(err))
//       .catch((err) => next(err));
//   });



blogRouter.route("/:blogId")
  .get((req, res, next) => {
    Blogs.findById(req.params.blogId)
      .then((blog) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(blog);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /blogs" + req.params.blogId);
  })

  .put((req, res, next) => {
    Blogs.findByIdAndUpdate(req.params.blogId, {
      $set: req.body
    }, { new: true })
      .then((blog) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(blog);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Blogs.findOneAndDelete(req.params.blogId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = blogRouter;
