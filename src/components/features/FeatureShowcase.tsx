import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FeatureShowcase: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t('features.safety.title'),
      description: t('features.safety.description'),
      icon: '🔒'
    },
    {
      title: t('features.ease.title'),
      description: t('features.ease.description'),
      icon: '✨'
    },
    {
      title: t('features.notifications.title'),
      description: t('features.notifications.description'),
      icon: '🔔'
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 p-8 rounded-xl border border-white/10"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-white/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase; 