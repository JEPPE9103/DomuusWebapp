import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type FooterSectionProps = {
  title: string;
  links: { label: string; path: string }[];
};

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div className="space-y-4">
    <h3 className="text-white font-semibold mb-4">{title}</h3>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            to={link.path}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const { t } = useTranslation();

  const productLinks = [
    { label: t('footer.links.howItWorks'), path: '/how-it-works' },
    { label: t('footer.links.history'), path: '/history' },
    { label: t('footer.links.pricing'), path: '/pricing' },
    { label: t('footer.links.enterprise'), path: '/enterprise' },
  ];

  const companyLinks = [
    { label: t('footer.links.about'), path: '/about' },
    { label: t('footer.links.blog'), path: '/blog' },
    { label: t('footer.links.careers'), path: '/careers' },
    { label: t('footer.links.contact'), path: '/contact' },
  ];

  const resourceLinks = [
    { label: t('footer.links.support'), path: '/support' },
    { label: t('footer.links.privacy'), path: '/privacy' },
    { label: t('footer.links.terms'), path: '/terms' },
  ];

  const socialLinks = [
    { label: 'Twitter', path: 'https://twitter.com' },
    { label: 'Instagram', path: 'https://instagram.com' },
    { label: 'LinkedIn', path: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-2">
            <Link to="/" className="text-teal-400 text-2xl font-bold mb-4 block">
              Domuus
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              {t('footer.about')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <FooterSection title={t('footer.sections.product')} links={productLinks} />
          <FooterSection title={t('footer.sections.company')} links={companyLinks} />
          <FooterSection title={t('footer.sections.resources')} links={resourceLinks} />
        </div>

        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Domuus. {t('footer.rights')}
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              {t('footer.links.privacy')}
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              {t('footer.links.terms')}
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
              {t('footer.links.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;