import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FcGoogle } from 'react-icons/fc'; // Google-ikon
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create username from first and last name
      const username = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
      
      // Register user
      await register(formData.email, formData.password, username);
      
      // Redirect to home page on success
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] px-4">
      <h1 className="text-3xl text-teal-400 font-bold mb-6">
        {t('auth.register.title')}
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-xl border border-white/10 w-full max-w-md space-y-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder={t('auth.register.firstName')}
          className="w-full p-3 rounded bg-black text-white border border-white/10"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder={t('auth.register.lastName')}
          className="w-full p-3 rounded bg-black text-white border border-white/10"
          required
        />
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
          minLength={6}
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder={t('auth.register.confirmPassword')}
          className="w-full p-3 rounded bg-black text-white border border-white/10"
          required
          minLength={6}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : t('auth.register.button')}
        </button>
      </form>

      <div className="text-white/60 my-4">eller</div>

      <button
        className="flex items-center gap-3 px-4 py-2 border border-white/10 rounded-lg text-white bg-white/10 hover:bg-white/20 transition"
      >
        <FcGoogle className="text-2xl" />
        {t('auth.register.withGoogle')}
      </button>
    </div>
  );
};

export default Register;
