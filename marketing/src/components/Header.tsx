import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title: string;
  navFeatures: string;
  navPricing: string;
  navLogin: string;
  ctaText: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  navFeatures,
  navPricing,
  navLogin,
  ctaText
}) => {
  return (
    <header>
      <div className="container header-content">
        <div className="logo">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h1>{title}</h1>
        </div>
        
        <div className="nav-links">
          <a href="#features">{navFeatures}</a>
          <a href="#pricing">{navPricing}</a>
          <a href="#">{navLogin}</a>
          <ThemeToggle />
        </div>
        
        <div className="header-actions">
          <div style={{ display: 'block' }}>
            <ThemeToggle />
          </div>
          <a href="#pricing" className="cta-button">
            {ctaText}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
