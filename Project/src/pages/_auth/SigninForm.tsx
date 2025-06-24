import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignInUser } from '../../hooks/api';

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Email:', email);
    console.log('Password:', password);

    SignInUser(email, password)
    .then(({ userId, token}) => {
      console.log('User ID:', userId);
      console.log('Token:', token);


      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);

      navigate('/Home');
    })
    .catch((error) => {
      console.log(error); 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center ">
      <div className="absolute inset-0 z-0">
        <img
          className="object-cover w-full h-full"
          src="\images\cover\cover-03.jpg"
          alt="Background"
        />
      </div>
      <form
        className="bg-white p-8 rounded shadow-lg max-w-sm w-full relative z-10"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl text-sidedark font-bold mb-4">Sign In</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label  className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white rounded py-2 px-4 hover:bg-primary transition duration-300"
        >
          
          Sign In
          
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-primary hover:underline">
            Sign up here
          </Link>
        </p>

      </form>
    </div>
  );
};

export default SigninForm;
