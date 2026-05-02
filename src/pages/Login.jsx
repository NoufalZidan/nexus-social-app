import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const newErrors = {};

      if (
        error.message.toLowerCase().includes("invalid login credentials") ||
        error.message.toLowerCase().includes("invalid email or password")
      ) {
        newErrors.general = "Email atau password salah";
      }

      if (error.message.toLowerCase().includes("email not confirmed")) {
        newErrors.general = "Email belum diverifikasi, cek inbox kamu";
      }

      if (error.message.toLowerCase().includes("email")) {
        newErrors.email = error.message;
      }

      setErrors(newErrors);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Log in Account</h1>
          <p className="mt-2 text-slate-500">Log in to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-medium text-sm text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
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
            <input
              type="password"
              name="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 transition"
          >
            Log in
          </button>
          {errors.general && (
            <p className="text-red-500 text-sm text-center">{errors.general}</p>
          )}
          <p className="text-center text-sm text-slate-500">
            Don't have an account? Create an account{" "}
            <Link to="/register">
              <span className="text-blue-400">here</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
