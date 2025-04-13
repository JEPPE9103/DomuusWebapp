import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from '../../context/AuthContext';

const menuVariants = {
  closed: { opacity: 0, scale: 0.95 },
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const menuItemVariants = {
  closed: { opacity: 0, y: 20 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
};

const Header = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('sv');

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'sv' ? 'en' : 'sv';
    setCurrentLanguage(newLanguage);
    // Add your language change logic here
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const languageToggleLabel = currentLanguage === 'sv' ? 'EN' : 'SV';

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center p-4 z-50">
      <header className="w-[98%] max-w-7xl bg-black/30 backdrop-blur-md rounded-2xl py-4 px-6 flex items-center justify-between border border-white/10 overflow-x-hidden">
        {/* Domuus Logo as Home link */}
        <Link to="/" className="text-teal-400 text-2xl font-bold">
          Domuus
        </Link>

        {/* Desktop Navigation (no more Home or History links) */}
        <nav className="hidden md:flex items-center space-x-8 px-4 mx-auto flex-grow justify-center">
          {/* No links here since we just have Domuus logo */}
        </nav>

        {/* Mobile Actions */}
        <nav className="md:hidden flex items-center space-x-4">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-lg transition-all duration-200 text-md font-medium cursor-pointer whitespace-nowrap"
            >
              {t("nav.signOut")}
            </button>
          ) : (
            <Link
              to="/register"
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-lg transition-all duration-200 text-md font-medium cursor-pointer whitespace-nowrap"
            >
              {t("nav.getApp")}
            </Link>
          )}

          <motion.button
            className="text-white p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={isMenuOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 },
              }}
              transition={{ duration: 0.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </motion.div>
          </motion.button>
        </nav>

        {/* Right side buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className="text-white/80 text-md hover:text-white transition-colors cursor-pointer"
              >
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded-lg transition-all duration-200 text-md font-medium cursor-pointer whitespace-nowrap"
              >
                {t("nav.signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white/80 text-md hover:text-white transition-colors cursor-pointer"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                to="/register"
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded-lg transition-all duration-200 text-md font-medium cursor-pointer whitespace-nowrap"
              >
                {t("nav.getApp")}
              </Link>
            </>
          )}
          <button
            onClick={toggleLanguage}
            className="text-white/60 hover:text-white transition-colors text-sm border border-white/20 px-3 py-1 rounded-lg"
          >
            {languageToggleLabel}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 z-40"
          >
            <motion.div
              className="flex flex-col justify-between h-full py-20"
              variants={{
                open: { opacity: 1, y: 0 },
                closed: { opacity: 0, y: -20 }
              }}
            >
              <div className="flex flex-col items-center justify-center flex-1">
                {/* No more items in mobile menu */}
              </div>
              <motion.div
                className="flex flex-col items-center space-y-6"
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -20 }
                }}
              >
                {currentUser ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-white/80 text-xl font-medium hover:text-white transition-colors cursor-pointer"
                    >
                      {t("nav.dashboard")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-2 rounded-lg transition-all duration-200 text-lg font-medium cursor-pointer whitespace-nowrap"
                    >
                      {t("nav.signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-white/80 text-xl font-medium hover:text-white transition-colors cursor-pointer"
                    >
                      {t("nav.signIn")}
                    </Link>
                    <Link
                      to="/register"
                      className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-2 rounded-lg transition-all duration-200 text-lg font-medium cursor-pointer whitespace-nowrap"
                    >
                      {t("nav.getApp")}
                    </Link>
                  </>
                )}
                <button
                  onClick={toggleLanguage}
                  className="text-white/60 hover:text-white transition-colors text-sm border border-white/20 px-3 py-1 rounded-lg"
                >
                  {languageToggleLabel}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
