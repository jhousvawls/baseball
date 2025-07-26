import React from 'react';

interface HeroProps {
  headline: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  image: string;
}

const Hero: React.FC<HeroProps> = ({
  headline,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  image
}) => {
  return (
    <main className="container hero">
      <h2>{headline}</h2>
      <p>{subtitle}</p>
      
      <div className="hero-actions">
        <a href="#pricing" className="cta-button">
          {ctaPrimary}
        </a>
        <a href="#features" className="cta-button secondary">
          {ctaSecondary}
        </a>
      </div>
      
      <div>
        {image.includes('baseball-practice-generator.web.app/app') ? (
          <div className="hero-app-preview">
            <iframe 
              src={image}
              title="Coach's Dugout Practice App Preview"
              className="hero-iframe"
              loading="lazy"
            />
            <div className="iframe-overlay">
              <a 
                href={image} 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button"
              >
                Try Live Demo →
              </a>
            </div>
          </div>
        ) : (
          <img 
            src={image} 
            alt="App screenshot on a phone and tablet" 
            className="hero-image"
          />
        )}
      </div>
    </main>
  );
};

export default Hero;
