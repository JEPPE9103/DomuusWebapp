import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BackgroundShapes from "../components/layout/BackgroundShapes";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] text-white relative overflow-hidden">
      <BackgroundShapes zIndex="z-0" />

      <div className="text-center pt-40 pb-24 px-6 max-w-4xl mx-auto relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-teal-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("howItWorks.title")}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 font-light mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("howItWorks.description")}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-white">
          <motion.div
            className="bg-black/20 p-6 rounded-xl border border-white/10 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-2">1. {t("howItWorks.step1Title")}</h3>
            <p className="text-gray-300">{t("howItWorks.step1Desc")}</p>
          </motion.div>

          <motion.div
            className="bg-black/20 p-6 rounded-xl border border-white/10 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-2">2. {t("howItWorks.step2Title")}</h3>
            <p className="text-gray-300">{t("howItWorks.step2Desc")}</p>
          </motion.div>

          <motion.div
            className="bg-black/20 p-6 rounded-xl border border-white/10 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-2">3. {t("howItWorks.step3Title")}</h3>
            <p className="text-gray-300">{t("howItWorks.step3Desc")}</p>
          </motion.div>
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/register"
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200"
          >
            {t("home.getStarted")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
