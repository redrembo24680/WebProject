import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full space-y-8 bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 relative z-10 animate-in fade-in duration-500">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="text-4xl">📝</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Note Manager
            </h2>
          </div>
          <p className="text-gray-400 text-sm">
            Вітаємо! Введіть ваші облікові дані
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-4 animate-in fade-in">
              <p className="text-sm font-medium text-red-300">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Електронна адреса 📧
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                Пароль 🔐
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center text-sm">
            <label className="flex items-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer transition">
              <input
                type="checkbox"
                className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 accent-blue-600"
              />
              <span>Запам'ятати мене</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <LogIn size={18} />
            {loading ? 'Входимо...' : 'Увійти'}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800/80 text-gray-400">або</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              Немає облікового запису?{' '}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 transition font-semibold"
              >
                Реєстрація
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
