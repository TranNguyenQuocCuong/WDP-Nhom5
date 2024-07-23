const express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/users");
const adminRouter = express.Router();
adminRouter.use(bodyParser.json());
const Blogs = require("../models/blog");

const Coaches = require("../models/coaches");
const Course = require('../models/courses');

adminRouter.route('/user')
  .get((req, res, next) => {
    Users.find({})
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Users.create(req.body)
      .then((user) => {
        console.log('User Created', user);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.status(403).send('PUT operation not supported on /user');
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
    res.end("PUT operation not supported on /users" + req.params.userId);
  })

  .put((req, res, next) => {
    Users.findByIdAndUpdate(req.params.userId, {
      $set: req.body
    }, { new: true })
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
    res.end("PUT operation not supported on /coaches" + req.params.coachId);
  })

  .put((req, res, next) => {
    Coaches.findByIdAndUpdate(req.params.coachId, {
      $set: req.body
    }, { new: true })
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

// Lấy thông tin coach và advisedUsers
adminRouter.route("/coach/:coachId")
  .get((req, res, next) => {
    Coaches.findById(req.params.coachId)
      .populate('advisedUsers')
      .then((coach) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(coach);
      })
      .catch((err) => next(err));
  });

// Lấy danh sách advisedUsers của coach
adminRouter.route("/coach/:coachId/advisedUsers")
  .get((req, res, next) => {
    Coaches.findById(req.params.coachId)
      .populate('advisedUsers')
      .then((coach) => {
        if (coach) {
          res.status(200).json({ advisedUsers: coach.advisedUsers });
        } else {
          const err = new Error('Coach ' + req.params.coachId + ' not found');
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    const { userIds } = req.body;
    Coaches.findById(req.params.coachId)
      .then((coach) => {
        if (coach) {
          coach.advisedUsers = [...coach.advisedUsers, ...userIds];
          coach.save()
            .then(updatedCoach => {
              Users.find({ '_id': { $in: updatedCoach.advisedUsers } })
                .then(users => {
                  res.status(200).json({ advisedUsers: users });
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        } else {
          const err = new Error('Coach ' + req.params.coachId + ' not found');
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  });


adminRouter.route("/course")
  .get((req, res, next) => {
    Course.find({})
      .then((courses) => {
        res.status(200).json(courses);
      })
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Course.create(req.body)
      .then((course) => {
        console.log('Course Created:', course);
        res.status(201).json(course); // 201 Created for new resource
      })
      .catch((err) => next(err));
  })

  .put((req, res) => {
    res.status(403).send("PUT operation not supported on /course");
  });

adminRouter.route("/course/:courseId")
  .get((req, res, next) => {
    Course.findById(req.params.courseId)
      .then((course) => {
        if (course) {
          res.status(200).json(course);
        } else {
          const err = new Error(`Course ${req.params.courseId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  .post((req, res) => {
    res.status(403).send("POST operation not supported on /course/" + req.params.courseId);
  })

  .put((req, res, next) => {
    Course.findByIdAndUpdate(req.params.courseId, { $set: req.body }, { new: true })
      .then((course) => {
        if (course) {
          res.status(200).json(course);
        } else {
          const err = new Error(`Course ${req.params.courseId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Course.findByIdAndDelete(req.params.courseId)
      .then((resp) => {
        if (resp) {
          res.status(200).json(resp);
        } else {
          const err = new Error(`Course ${req.params.courseId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });


//Blog

adminRouter.route("/blog")
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



adminRouter.route("/blog/:blogId")
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



module.exports = adminRouter;
