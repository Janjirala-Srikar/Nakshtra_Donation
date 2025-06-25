import React, { useState } from 'react';
import { signupUserWithGoogle, signupUser } from '../services/auth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';

function Signup() {
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', phone: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(form);
      alert('Signup successful!');
      navigate('/signin');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signupUserWithGoogle();
      alert('Google Signup successful!');
      navigate('/dashboard');
    } catch (err) {
      alert('User exists');
      navigate('/signin');
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 mt-8 relative overflow-hidden"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80 }}
      >
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full opacity-40 z-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6 relative z-10">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="grid grid-cols-1 gap-4">
            {['name', 'username', 'email', 'phone', 'password'].map((field, idx) => (
              <motion.input
                key={field}
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * idx + 0.3 }}
              />
            ))}
          </div>
          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg mt-6 transition"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <motion.button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-lg mb-2 transition"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaGoogle /> Sign Up with Google
        </motion.button>
        <div className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-600 hover:underline font-semibold">Sign In</Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Signup;
