import React, { useState } from 'react';
import { signinUser, signinWithGoogle } from '../services/auth';
import { Link, useNavigate } from 'react-router-dom';

function Signin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signinUser(form);
      alert('Signin successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signinWithGoogle();
      alert('Google Signin successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Sign In to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg mt-2 transition">Sign In</button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <button type="button" onClick={handleGoogle} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-lg mb-2 transition">
          Sign in with Google
        </button>
        <div className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline font-semibold">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Signin;
