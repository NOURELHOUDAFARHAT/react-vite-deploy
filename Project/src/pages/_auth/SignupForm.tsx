import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; // Import useEffect if needed
import user from '../../../public/images/user/avatar-1.png'
import React from 'react';
import { SignUpUser } from '../../hooks/api';





const SignupForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return; // Don't proceed further if passwords don't match
    }
    const avatar = user;

    SignUpUser(fullName, email, password,avatar)
    .then((result) => {
      
      console.log(result);
      localStorage.setItem('fullName', fullName);
      navigate('/');
    })
    .catch((err) => console.log(err));
  };




 

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center ">
      <div className="absolute inset-0 z-0">
        <img
          className="object-cover w-full h-full"
          src="\images\cover\cover-02.jpg"
          alt="Background"
        />
      </div>
      <form
        className="bg-white p-8 rounded shadow-lg max-w-sm w-full relative z-10"
        onSubmit={handleSubmit}
      >
        {/* Form fields */}
        <h2 className="text-2xl text-sidedark font-bold mb-4">Sign Up</h2>
        <div className="mb-4">
          <label  className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label  className="block text-sm font-medium mb-2">
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

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary "
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary text-white rounded py-2 px-4 hover:bg-primary transition duration-300"
        >
            Sign Up
        </button>
        {/* Sign in link */}
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
