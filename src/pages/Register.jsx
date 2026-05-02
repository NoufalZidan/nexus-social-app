import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [checkPass, setCheckPass] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      const newErrors = {};

      if (error.message.toLowerCase().includes("password")) {
        newErrors.password = error.message;
      }

      if (error.message.toLowerCase().includes("email")) {
        newErrors.email = error.message;
      }

      setErrors(newErrors);

      return;
    }
    alert("Register berhasil! Cek email kamu untuk verifikasi.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          <p className="mt-2 text-slate-500">Register to continue</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-medium text-sm text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="block font-medium text-sm text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block font-medium text-sm text-slate-700 mb-2">
              Password
            </label>
            <div className="flex">
              <input
                type={checkPass ? "text" : "password"}
                name="password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border-l border-t border-b flex-1 border-slate-300 rounded-l-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button type="button" className="p-3 border-t border-b border-r border-slate-300 rounded-r-xl" onClick={() => setCheckPass(prev => !prev)}>
                {checkPass ? (
                  <IoMdEyeOff />
                ) : (
                  <IoMdEye />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 transition"
          >
            Register
          </button>
          <p className="text-center text-sm text-slate-500">
            Already have an account? Log in{" "}
            <Link to="/login">
              <span className="text-blue-400">here</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
