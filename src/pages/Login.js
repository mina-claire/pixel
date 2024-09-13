// Import dependencies and declarations

import { useEffect, useState, useContext } from 'react';
import { TaskContext } from '../TaskContext'
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Spin } from 'antd';
import { requestLogin } from '../data/api';
import logo from '../components/images/logo.svg'

/**
 * Pixel Login Page Component
 * Allows user to login/create their pixel account.
 * 
 * @route /login
 * @description Page allows user to login and create a Pixel account via
 * Google OAuth. Upon verification, login page redirects to user Dashboard.
 */
function Login() {

  // Import global context & routes
  const { setUser, loading } = useContext(TaskContext);
  const navigate = useNavigate();

  // Initialise local states
  const [signIn, setSignIn] = useState(false);

  /**
   * Redirect user to dashboard upon email authentication
   * Set fetched data to global user context
   */
  useEffect(() => {
    if (!loading) {
      navigate('/dashboard');
    }
  }, [loading, navigate]);

  /**
   * Authenticate user login request, and retrive or initialise user data
   * @param {json} response 
   */
  const handleLogin = async (response) => {
    setSignIn(true);
    const userData = await requestLogin(response);
    setUser(userData);
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center overflow-hidden">
      {!signIn ? (
        <div className="w-[27rem] transform -translate-y-[5rem]">

          {/** Render pixel logo & slogan */}
          <div className="flex justify-center items-center">
            <img
              className="mb-lg w-logo"
              src={logo}
              alt="Logo"
            />
          </div>
          <p className="text-h1 text-md font-heavy cursor-default">
            Piece by piece, task by task
          </p>
          <p className="text-text opacity-50 text-md font-base cursor-default">
            Login to your Pixel account...
          </p>

          {/** Render Google OAUTH login button */}
          <div className="mt-lg mb-md">
            <GoogleLogin
              onSuccess={handleLogin}
              useOneTap={false}
              ux_mode="popup"
              size="large"
              text="signin_with"
          />
          </div>

          {/** Display link for Pixel's T&Cs */}
          <p className="text-text opacity-80 text-end text-sm font-medium underline
                        hover:cursor-pointer hover:opacity-100">
              terms & conditions 🎀
          </p>
        </div>
      ) : (
        <Spin size="large" /> // Render spinner during Google authentication
      )}
    </div>
  );
}
export default Login;