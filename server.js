const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/users');
const AdviceRoute = require('./routes/advice');
const moment = require('moment');
const crypto = require('crypto');
const Workout = require('./models/workout');
const Schedule = require('./models/schedule');
const session = require('express-session');



const app = express();

const secret = crypto.randomBytes(32).toString('hex');
console.log('Generated secret:', secret);


app.use(session({
  secret: secret, // Sử dụng chuỗi bí mật ở đây
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Chỉnh sửa nếu sử dụng HTTPS
}));

// Đảm bảo session middleware được sử dụng trước các route khác
app.use(function (req, res, next) {
  res.locals.email = req.session.email;
  next();
});

// Middleware
app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000', 'http://example2.com'];
app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is allowed or not
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow credentials
}));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gym', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
const userRoutes = require('./routes/web');
const courseRoutes = require('./routes/courses'); // Thêm route courses
// const forgotpasswordRoutes = require('./routes/forgotpassword');
const adviceRoutes = require('./routes/advice');
const coachRoutes = require('./routes/coaches');
const buyCourseRoutes = require('./routes/buycourse');
const adminRouter = require('./routes/adminRouter');
const reportRouter = require('./routes/reportRouter');
const paymentRoutes = require('./routes/payment');
const attendanceRoutes = require('./routes/attendance');
const workoutRoutes = require('./routes/workouts');
const revenueRoutes = require('./routes/revenueController')
const workoutRouter = require('./routes/workout');

// Shop Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes); // Sử dụng route courses
// app.use('/forgotpassword', forgotpasswordRoutes);
app.use('/api/buy', buyCourseRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/reports', reportRouter);
app.use('/api/admins', adminRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/workouts', workoutRouter);
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);

// Reset password route
app.post('/resetpassword/:id/:token', (req, res) => {
  const { id, token } = req.params
  const { password } = req.body

  console.log('ID:', id);
  console.log('Token:', token);
  console.log('Password:', password);
  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" })
    } else {
      bcrypt.hash(password, 10)
        .then(hash => {
          User.findByIdAndUpdate({ _id: id }, { password: password })
            .then(u => res.send({ Status: "Success" }))
            .catch(err => res.send({ Status: err }))
        })
        .catch(err => res.send({ Status: err }))
    }
  })
});




app.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    console.log(">>> workouts", workouts);
    res.json(workouts);
  } catch (error) {
    res.status(500).send('Server error');
  }
});




// POST route to update Schedule
const isDuplicateWorkoutIds = async (userId, date, workoutIds) => {
  try {
    // Tìm kiếm lịch trình của userId và ngày cụ thể
    const existingSchedule = await Schedule.findOne({
      userId,
      'dailyWorkouts.date': date,
      'dailyWorkouts.workouts': { $in: workoutIds }
    });

    return !!existingSchedule; // Trả về true nếu tìm thấy lịch trình có workoutIds trùng, ngược lại trả về false
  } catch (error) {
    console.error('Error checking for duplicate workoutIds:', error);
    return true; // Trả về true nếu có lỗi xảy ra trong quá trình kiểm tra
  }
};

// Sử dụng trong route '/update-schedule'
app.post('/update-schedule', async (req, res) => {
  const { userId, coachId, date, workoutIds, status } = req.body;
  console.log('>>> date: ', date, '   >>> workoutIds: ', workoutIds);

  try {
    // Kiểm tra xem đã có workoutIds trùng lặp trong ngày đó chưa
    const isDuplicate = await isDuplicateWorkoutIds(userId, date, workoutIds);
    if (isDuplicate) {
      return res.status(400).json({ message: 'Duplicate workoutIds for the specified date' });
    }

    // Tạo một lịch trình mới
    const newSchedule = new Schedule({
      userId,
      coach: coachId,
      dailyWorkouts: [{
        date,
        workouts: workoutIds,
        status
      }]
    });

    // Lưu vào MongoDB
    await newSchedule.save();

    // Gửi phản hồi thành công
    res.status(200).json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Error updating schedule:', error);
    // Gửi phản hồi lỗi
    res.status(500).json({ message: 'Failed to update schedule. Please try again later.' });
  }
});


app.get('/getScheduleWithWorkouts/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Truy vấn Schedule collection để lấy các lịch trình của userId và nạp workouts tương ứng
    const schedules = await Schedule.find({ userId }).populate({
      path: 'dailyWorkouts.workouts',
      select: 'name', // Chọn chỉ mục 'name' từ schema Workout
    });

    // Chuẩn bị dữ liệu phản hồi với các trường cần thiết, bao gồm _id
    const formattedSchedules = schedules.map((schedule) => ({
      _id: schedule._id,
      userId: schedule.userId,
      coachId: schedule.coach,
      dailyWorkouts: schedule.dailyWorkouts.map((day) => ({
        date: day.date,
        workouts: day.workouts.map((workout) => workout.name), // Trích xuất tên bài tập
        status: day.status,
      })),
    }));

    // Gửi phản hồi với dữ liệu đã được định dạng
    res.json(formattedSchedules);
  } catch (error) {
    console.error('Lỗi khi lấy lịch trình:', error);
    res.status(500).json({ message: 'Không thể lấy lịch trình. Vui lòng thử lại sau.' });
  }
});




// Assuming you have imported necessary modules and defined your model

// Endpoint to remove event from schedule
app.delete('/remove-schedule/:scheduleId', async (req, res) => {
  const { scheduleId } = req.params;
  console.log('>>> scheduleId: ', scheduleId);

  try {
    // Use findByIdAndDelete to remove the schedule entry by ID
    const schedule = await Schedule.findByIdAndDelete(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }

    // Send success response
    res.status(200).json({ message: 'Schedule removed successfully.' });
  } catch (error) {
    console.error('Error removing schedule:', error);
    // Send error response
    res.status(500).json({ message: 'Failed to remove schedule. Please try again later.' });
  }
});


app.get('/getUserWorkoutSchedule', async (req, res) => {
  try {
    const userId = req.query.userId; // Assume userId is passed as a query parameter
    console.log(">>> userId : ", userId);
    // Query the Schedule collection to get all schedules for the specified userId and populate corresponding workouts
    const schedules = await Schedule.find({ userId }).populate({
      path: 'dailyWorkouts.workouts',
      select: 'name video description', // Select the fields you need from the Workout schema
    });

    // Prepare the response data with the necessary fields, including _id
    const formattedSchedules = schedules.map((schedule) => ({
      _id: schedule._id,
      userId: schedule.userId,
      coachId: schedule.coach,
      dailyWorkouts: schedule.dailyWorkouts.map((day) => ({
        date: day.date,
        workouts: day.workouts.map((workout) => ({
          name: workout.name,
          video: workout.video,
          description: workout.description,
        })),
        status: day.status, // Include the status field
      })),
    }));

    // Group schedules by date to avoid duplicate dates
    const groupedSchedules = groupByDateAndMerge(formattedSchedules);

    // Send the response with the grouped data
    res.json(groupedSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Unable to fetch schedules. Please try again later.' });
  }
});

// Function to group workouts by date and merge them
const groupByDateAndMerge = (schedules) => {
  const groupedSchedules = [];

  schedules.forEach((schedule) => {
    schedule.dailyWorkouts.forEach((day) => {
      // Check if there is already a grouped schedule for this date
      const existingSchedule = groupedSchedules.find((grouped) =>
        moment(grouped.date).isSame(day.date, 'day')
      );

      if (existingSchedule) {
        // Merge workouts into existing schedule
        existingSchedule.workouts.push(...day.workouts);
      } else {
        // Create new grouped schedule entry
        groupedSchedules.push({
          date: day.date,
          workouts: day.workouts,
          status: day.status, // Include the status field
        });
      }
    });
  });

  return groupedSchedules;
};


app.put('/updateWorkoutStatus', async (req, res) => {
  const { userId, date, status } = req.body;

  try {
    // Convert date to ISO format if needed
    const isoDate = new Date(date);

    // Find and update the status for all workouts in the specified date
    const schedule = await Schedule.findOneAndUpdate(
      { userId, 'dailyWorkouts.date': isoDate },
      { $set: { 'dailyWorkouts.$.status': status } },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Unable to update status. Please try again later.' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
