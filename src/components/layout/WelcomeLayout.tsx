import React from 'react';
import { motion } from 'framer-motion';
import BackgroundShapes from './BackgroundShapes';
import FeatureShowcase from '../features/FeatureShowcase';
import { useTranslation } from 'react-i18next';

interface WelcomeLayoutProps {
  showCheckButtons?: boolean;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
}

const WelcomeLayout: React.FC<WelcomeLayoutProps> = ({ 
  showCheckButtons = false,
  onCheckIn,
  onCheckOut
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-[#1a1a1a] overflow-hidden">
      <BackgroundShapes />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {t('dashboard.welcome')}
              </h1>
              <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                {t('dashboard.description')}
              </p>
              
              {showCheckButtons ? (
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCheckIn}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium"
                  >
                    {t('common.checkIn')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCheckOut}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium"
                  >
                    {t('common.checkOut')}
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium"
                >
                  {t('home.cta')}
                </motion.button>
              )}
            </motion.div>
          </div>
        </section>

        {/* Feature Showcase */}
        <FeatureShowcase />

        {/* How It Works Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('howItWorks.title')}
                </h2>
                <p className="text-white/60 mb-8">
                  {t('howItWorks.description')}
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('howItWorks.step1Title')}
                    </h3>
                    <p className="text-white/60">
                      {t('howItWorks.step1Desc')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('howItWorks.step2Title')}
                    </h3>
                    <p className="text-white/60">
                      {t('howItWorks.step2Desc')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('howItWorks.step3Title')}
                    </h3>
                    <p className="text-white/60">
                      {t('howItWorks.step3Desc')}
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-video bg-white/5 rounded-xl border border-white/10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                {t('home.historyTitle')}
              </h2>
              <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                {t('home.historyDescription')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium"
              >
                {t('home.viewHistoryButton')}
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WelcomeLayout; 