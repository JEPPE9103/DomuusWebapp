import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackgroundShapes from "../components/layout/BackgroundShapes";
import FeatureShowcase from "../components/common/FeatureShowcase";
import { motion } from "framer-motion";
import howItWorksImage from "../assets/images/howitworks.png";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full relative overflow-hidden">
      <BackgroundShapes zIndex="z-0" />

      {/* Hero Section */}
      <div className="text-center text-white relative z-10 pt-48 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-light mb-8 md:mb-4">
            {t("home.welcome")}{" "}
            <span className="font-semibold text-teal-400">Domuus</span>
          </h1>
          <p className="text-3xl font-light opacity-90 mb-8">
            {t("home.description")}
          </p>
          <Link
            to="/register"
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200"
          >
            {t("home.cta")}
          </Link>
          <p className="text-gray-400 mt-4">
            {t("home.alreadyAccount")}{" "}
            <Link to="/login" className="text-teal-400 underline">
              {t("home.loginHere")}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <FeatureShowcase />

      {/* How It Works Section */}
      <div className="bg-[#121212] py-24 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("howItWorks.title")}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {t("howItWorks.description")}
          </p>
          {/* Replaced video placeholder with image */}
          <div className="mb-8">
            <img
              src={howItWorksImage}
              alt="How it works"
              className="w-full rounded-xl shadow-lg border border-white/10"
            />
          </div>
          <Link
            to="/register"
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200"
          >
            {t("howItWorks.button")}
          </Link>
        </motion.div>
      </div>

      {/* History Section (after How It Works) */}
      <div className="bg-[#121212] py-16 px-4 text-center relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("home.historyTitle")}
        </motion.h2>
        <motion.p
          className="text-gray-300 text-lg leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("home.historyDescription")}
        </motion.p>
        <Link
          to="/history"
          className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200"
        >
          {t("home.viewHistoryButton")}
        </Link>
      </div>
    </div>
  );
};

export default Home;
