import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/'); // Redirect to home page after successful login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] px-4">
      <h1 className="text-3xl text-teal-400 font-bold mb-6">{t('auth.login.title')}</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-xl border border-white/10 w-full max-w-md space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('auth.login.email')}
          className="w-full p-3 rounded bg-black text-white border border-white/10"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={t('auth.login.password')}
          className="w-full p-3 rounded bg-black text-white border border-white/10"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : t('auth.login.button')}
        </button>
      </form>

      <div className="text-white/60 my-4">{t('auth.login.or')}</div>

      <div className="flex flex-col gap-3 w-full max-w-md">
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
          <FcGoogle className="text-2xl" />
          {t('auth.login.withGoogle')}
        </button>
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
          <FaFacebookF className="text-lg" />
          {t('auth.login.withFacebook')}
        </button>
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#0077b5] hover:bg-[#005f91] text-white">
          <FaLinkedinIn className="text-lg" />
          {t('auth.login.withLinkedIn')}
        </button>
      </div>
    </div>
  );
};

export default Login;