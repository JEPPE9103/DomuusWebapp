import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <motion.div
    variants={itemVariants}
    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
  >
    <div className="text-teal-400 mb-4 text-3xl">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const FeatureShowcase = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-4 py-16"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <motion.div 
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <FeatureCard
          icon={<span>📍</span>}
          title={t('features.checkin.title')}
          description={t('features.checkin.description')}
        />
        <FeatureCard
          icon={<span>🔔</span>}
          title={t('features.notifications.title')}
          description={t('features.notifications.description')}
        />
        <FeatureCard
          icon={<span>🛡️</span>}
          title={t('features.privacy.title')}
          description={t('features.privacy.description')}
        />
      </motion.div>
    </motion.div>
  );
};

export default FeatureShowcase;