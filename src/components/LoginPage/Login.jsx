// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import ReactDOM from "react-dom";
import "./LoginC.css";
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import ResponsiveAppBar from "./ButtonAppBar";

import axios from 'axios';

function Login() {

  const [username] = useState('');
  const [password] = useState('');

  // Reacts navigate
  const navigate = useNavigate()

  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // User Login info
  // const database = [
  //   {
  //     username: "user1",
  //     password: "pass1"
  //   },
  //   {
  //     username: "user2",
  //     password: "pass2"
  //   }
  // ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };


  const handleSubmit = async (event) => {
    //Prevent page reload
    // event.preventDefault();

    // var { uname, pass } = document.forms[0];

    // // Find user login info
    // const userData = axios.find((user) => user.username === uname.value);

    // // Compare user info
    // if (userData) {
    //     if (userData.password !== pass.value) {
    //       // Invalid password
    //       setErrorMessages({ name: "pass", message: errors.pass });
    //     } else {
    //       setIsSubmitted(true);
    //     }
    //   } else {
    //     // Username not found
    //     setErrorMessages({ name: "uname", message: errors.uname });
    //   }

    //   try {
    //     const response = await axios.post('/api/login', {
    //       username,
    //       password,
    //     });
    
    //     // ตรวจสอบการล็อกอินสำเร็จ และจัดการข้อมูลตามความต้องการ
    //     if (response.data.success) {
          // ทำการล็อกอินสำเร็จ
          navigate('/addSubject')
      //   } else {
      //     // ทำการล็อกอินไม่สำเร็จ แสดงข้อความผิดพลาดหรือกระทำอื่นที่เหมาะสม
      //   }
      // } catch (error) {
      //   // การร้องขอ API ล้มเหลว แสดงข้อผิดพลาดหรือกระทำอื่นที่เหมาะสม
      // }
    };
  
    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
      name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
      );
 
    // JSX code for login form
  const renderForm = (
   
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" 
            onClick={handleSubmit} 
          />
        </div>
      </form>
    </div>
    
  );

  return (
    <div className="wallpaper">
      <div className="barContainer"><ResponsiveAppBar></ResponsiveAppBar>
        <div className="app">
          <div className="login-form">
            <div className="title">Sign In</div>
              {isSubmitted ? <div>
            </div> : renderForm}
          </div>
        </div>
        </div>
    </div>
  )
}

export default Login