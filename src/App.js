import React, { useState } from "react";
import { HashRouter as Router, Switch, Redirect, Route, Routes } from "react-router-dom";
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

import Navbar from './components/Navbar';
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
import Footer from './components/Footer';

// import Topbar from "./admin-pages/Topbar";
// import Sidebar from "./admin-pages/Sidebar";
// import Dashboard from "./admin-pages/dashboard";
// import Team from "./admin-pages/team";
// import Invoices from "./admin-pages/invoices";
// import Contacts from "./admin-pages/contacts";
// import Bar from "./admin-pages/bar";
// import Form from "./admin-pages/form";
// import Line from "./admin-pages/line";
// import Pie from "./admin-pages/pie";
// import FAQ from "./admin-pages/faq";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import { ColorModeContext, useMode } from "./theme";
// import Calendar from "./admin-pages/calendar";

function App() {
  // const [theme, colorMode] = useMode();
  // const [isSidebar, setIsSidebar] = useState(true);

  return (
    <Router>
      <Navbar />

      <Switch>

        <Route exact path="/" component={HomeNav}></Route>
        <Route exact path="/home" component={HomeNav}></Route>
        {/* <Redirect exact from="/Gym-Website/" to="/home" /> */}
        <Route exact path="/about" component={AboutNav}></Route>
        <Route exact path="/course" component={CourseNav}></Route>
        <Route exact path="/coach" component={CoachNav}></Route>
        <Route exact path="/features" component={FeaturesNav}></Route>
        <Route exact path="/contact" component={ContactNav}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/forgotpassword" component={ForgotPasswordNav}></Route>
        <Route path="/resetpassword/:id/:token" component={ResetPassword}></Route>
        <Route exact path="/resetpassword" component={ResetPassword}></Route>
        <Route exact path="/courseDetail" component={courseDetailNav}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/checkout" component={Checkout}></Route>
        <Route exact path="/userProfile" component={UserProfile}></Route>

        //
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
      </Switch>

      <Footer />
    </Router>


  );
}

export default App;
