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
import EditUserSchedule from "./pages/EditUserScheduleNav";
import UserSchedule from "./pages/UserScheduleNav";
import BillingForm from "./pages/BillingFormNav";


import HomeAdmin from "./admin-pages/HomeAdminNav";

import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';
import UserDetailNav from './admin-pages/UserDetailNav'
import CoachAdminNav from './admin-pages/CoachAdminNav'
import RevenueAdminNav from './admin-pages/RevenueAdminNav'
import ClassAdminNav from './admin-pages/ClassAdminNav'
import CourseAdminNav from './admin-pages/CourseAdminNav'

//shop
import ProductListScreen from './pages/ProductListNav';
import CartScreen from './pages/CartScreenNav';
import PaymentMethodScreen from './components/PaymentMethodScreen';
import ProductAdminScreen from './admin-components/ProductAdminScreen';
import UserTransactions from './pages/UserTransactionNav';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/forgotpassword" component={ForgotPasswordNav}></Route>
        <Route exact path="/resetpassword/:id/:token" component={ResetPassword}></Route>
        {/* <Route exact path="/resetpassword" component={ResetPassword}></Route> */}

        <Route exact path="/admin" component={HomeAdmin} />
        <Route exact path="/admin/user/:userId" component={UserDetailNav} />
        <Route exact path="/admin/coaches" component={CoachAdminNav} />
        <Route exact path="/admin/revenues" component={RevenueAdminNav} />
        <Route exact path="/admin/classes" component={ClassAdminNav} />
        <Route exact path="/admin/courses" component={CourseAdminNav} />
        <Route path="/admin/products" component={ProductAdminScreen} />

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

              //shop
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
