import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import './components/Navbar.css'
import './components/Banner.css'
import './components/GymClass.css'
import './components/About.css'
import './components/ChoseUs.css'
import './components/Team.css'
import './components/Subscribe.css'
import './components/MonthlyPlan.css'
import './components/BMI.css'
import './components/Testimonial.css'
import './components/Footer.css'
import './components/PageHeader.css'
import './components/Features.css'
import './components/Services.css'
import './components/Contact.css'

import './responsive.css'

import Navbar from './components/navbar';
import HomeNav from "./pages/HomeNav";
import AboutNav from "./pages/AboutNav";
import CourseNav from "./pages/CourseNav";
import CoachNav from "./pages/CoachNav";
import FeaturesNav from "./pages/FeaturesNav";
import ContactNav from "./pages/ContactNav";
import courseDetailNav from "./pages/courseDetailNav";
import Login from "./pages/Login";
import ForgotPasswordNav from "./pages/ForgotPasswordNav";
import ResetPassword from "./pages/ResetPasswordNav";
import Signup from "./pages/Signup";
import Checkout from "./pages/CheckoutNav";
import UserProfile from "./pages/UserProfile";
import ViewAndSubmitCourseNav from "./pages/ViewAndSubmitCourseNav";
import GiveAdviceNav from "./pages/GiveAdviceNav";
import EditProfileNav from "./pages/EditProfileNav";
import TakeAttendanceNav from "./pages/TakeAttendanceNav";
import CoachDashboardNav from "./pages/CoachDashBoardNav";
import CoachLoginNav from "./pages/CoachLoginNav";
import EditUserSchedule from "./pages/EditUserScheduleNav";
import UserSchedule from "./pages/UserScheduleNav";
import BillingForm from "./pages/BillingFormNav";


import LoginAdmin from "./admin-pages/LoginAdminNav";
import HomeAdmin from "./admin-pages/HomeAdminNav";

import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';
import UserDetailNav from './admin-pages/UserDetailNav'
import ProfileAdminNav from './admin-pages/ProfileAdminNav'
import CoachAdminNav from './admin-pages/CoachAdminNav'
import RevenueAdminNav from './admin-pages/RevenueAdminNav'
import ClassAdminNav from './admin-pages/ClassAdminNav'
import CourseAdminNav from './admin-pages/CourseAdminNav'
import WorkoutAdminNav from './admin-pages/WorkoutAdminNav'
import ProductAdminNav from './admin-pages/ProductAdminNav';
import TransactionsAdminNav from './admin-pages/TransactionsAdminNav';
import BlogAdminNav from './admin-pages/BlogAdminNav'

//shop
import ProductListScreen from './pages/ProductListNav';
import CartScreen from './pages/CartScreenNav';
import PaymentMethodScreen from './components/PaymentMethodScreen';
import UserTransactions from './pages/UserTransactionNav';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/checkout" component={Checkout}></Route>
        <Route exact path="/userProfile" component={UserProfile}></Route>
        <Route exact path="/coachProfile" component={EditProfileNav} />
        <Route exact path="/giveAdvice" component={GiveAdviceNav} />
        <Route exact path="/createCourse" component={ViewAndSubmitCourseNav} />
        <Route exact path="/takeAttendance" component={TakeAttendanceNav} />
        <Route exact path="/coachDashboard" component={CoachDashboardNav} />
        <Route exact path="/coachLogin" component={CoachLoginNav} />
        
        {/* <Route path="/" element={<Dashboard />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/form" element={<Form />} />
        <Route path="/bar" element={<Bar />} />
        <Route path="/pie" element={<Pie />} />
        <Route path="/line" element={<Line />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/calendar" element={<Calendar />} /> */}
        <Route exact path="/forgotpassword" component={ForgotPasswordNav}></Route>
        <Route exact path="/resetpassword/:id/:token" component={ResetPassword}></Route>
        {/* <Route exact path="/resetpassword" component={ResetPassword}></Route> */}

        <Route exact path="/admin/login" component={LoginAdmin} />


        <Route exact path="/admin" component={LoginAdmin} />
        <Route exact path="/admin/home" component={HomeAdmin} />
        <Route exact path="/admin/users" component={HomeAdmin} />
        <Route exact path="/admin/profile" component={ProfileAdminNav} />
        <Route exact path="/admin/user/:userId" component={UserDetailNav} />
        <Route exact path="/admin/coaches" component={CoachAdminNav} />
        <Route exact path="/admin/blogs" component={BlogAdminNav} />
        <Route exact path="/admin/revenues" component={RevenueAdminNav} />
        <Route exact path="/admin/classes" component={ClassAdminNav} />
        <Route exact path="/admin/courses" component={CourseAdminNav} />
        <Route exact path="/admin/workouts" component={WorkoutAdminNav} />
        <Route exact path="/admin/products" component={ProductAdminNav} />
        <Route exact path="/admin/transactions" component={TransactionsAdminNav} />

        <Route>
          <MainLayout>
            <Switch>
              <Route exact path="/" component={HomeNav} />
              <Route exact path="/home" component={HomeNav} />
              <Route exact path="/about" component={AboutNav} />
              <Route exact path="/course" component={CourseNav} />
              <Route exact path="/coach" component={CoachNav} />
              <Route exact path="/features" component={FeaturesNav} />
              <Route exact path="/contact" component={ContactNav} />
              <Route exact path="/courseDetail" component={courseDetailNav} />
              <Route exact path="/checkout" component={Checkout} />
              <Route exact path="/userProfile" component={UserProfile} />
              <Route exact path="/editUserSchedule" component={EditUserSchedule} />
              <Route exact path="/userSchedule" component={UserSchedule} />
              <Route exact path="/billing" component={BillingForm} />

              
              <Route path="/shop" component={ProductListScreen} exact />
              <Route path="/cart" component={CartScreen} />
              <Route path="/user/transactions" component={UserTransactions} />
              <Route path="/payment" component={PaymentMethodScreen} />
            </Switch>
          </MainLayout>
        </Route>
      </Switch>
    </Router >
  );
}

export default App;
