const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Users = require("../models/users");
const Transaction = require('../models/Order');
const Coaches = require("../models/coaches");
const Course = require('../models/courses');
const Admin = require("../models/admin");
const adminRouter = express.Router();
adminRouter.use(bodyParser.json());


const JWT_SECRET = '5a3d9f8d2b8a4c7a1e6f9d4c3b2a7e8d';

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'phandinhdan6666@gmail.com',
    pass: 'nxum kgxi agdf rnvi'
  }
});

// Add login route
adminRouter.route('/adminLogin')
  .post((req, res) => {
    const { username, password } = req.body;
    console.log('>>> ', username, password);

    Admin.findOne({ username })
      .then(admin => {
        if (!admin) {
          return res.status(401).json({ message: 'Authentication failed. Admin not found.' });
        }

        if (password !== admin.password) {
          return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
        }

        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
      })
      .catch(err => res.status(500).json({ message: 'Server error', err }));
  });


// Forgot password route
adminRouter.route('/adminforgot')
  .post((req, res) => {
    Admin.findOne() // Assuming only one admin exists
      .then(admin => {
        if (!admin) {
          return res.status(404).json({ message: 'Admin not found' });
        }

        console.log('>>> adm: ', admin, admin.email);

        // Send email with admin's username and password
        const mailOptions = {
          from: 'phandinhdan6666@gmail.com',
          to: admin.email,
          subject: 'Password Reset Request',
          text: `Hello ${admin.username},\n\nYour current username is: ${admin.username}\nPassword is: ${admin.password}\n\nPlease change it as soon as possible.\n\nBest regards,\nFitZone Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).json({ message: 'Failed to send email', error });
          }
          console.log('Password reset email sent');
          res.status(200).json({ message: 'Password reset email sent' });
        });
      })
      .catch(err => res.status(500).json({ message: 'Server error', err }));
  });

adminRouter.route('/adminProfile')
  .get((req, res, next) => {
    Admin.findOne({})
      .then((admin) => {
        if (admin) {
          res.status(200).json(admin);
        } else {
          const err = new Error('Admin profile not found');
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    Admin.findOneAndUpdate({}, { $set: req.body }, { new: true })
      .then((admin) => {
        if (admin) {
          res.status(200).json(admin);
        } else {
          const err = new Error('Admin profile not found');
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });



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

/// Lấy thông tin coach và advisedUsers
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
  })
  // Xóa advisedUsers
  .delete((req, res, next) => {
    const { userIds } = req.body;
    Coaches.findById(req.params.coachId)
      .then((coach) => {
        if (coach) {
          coach.advisedUsers = coach.advisedUsers.filter(userId => !userIds.includes(userId.toString()));
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



// Get all transactions with optional pagination
adminRouter.get('/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const transactions = await Transaction.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user', 'username name email'); // Populating user data

    const totalTransactions = await Transaction.countDocuments();
    res.json({
      transactions,
      totalPages: Math.ceil(totalTransactions / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get transaction by ID
adminRouter.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = adminRouter;
