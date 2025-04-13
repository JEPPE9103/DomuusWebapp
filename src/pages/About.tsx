import React from "react";
import { useTranslation } from "react-i18next";
import BackgroundShapes from "../components/layout/BackgroundShapes";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[#1a1a1a] text-white">
      <BackgroundShapes zIndex="z-0" />

      <div className="text-center pt-40 pb-24 px-6 max-w-4xl mx-auto relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-teal-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("about.title")}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200 font-light mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("about.paragraph1")}
        </motion.p>

        <motion.p
          className="text-base md:text-lg text-gray-400 italic leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {t("about.paragraph2")}
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/register"
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-200"
          >
            {t("home.getStarted")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
