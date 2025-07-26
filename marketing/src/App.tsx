import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import AdminButton from './components/admin/AdminButton';
import LoginForm from './components/admin/LoginForm';
import AdminMode from './components/admin/AdminMode';
import SectionEditor from './components/admin/SectionEditor';
import { useContent } from './hooks/useContent';
import { useAuth } from './hooks/useAuth';
import type { MarketingContent } from './lib/types';
import './index.css';

const Testimonial: React.FC<{ testimonial: MarketingContent['testimonial'] }> = ({ testimonial }) => (
  <section className="testimonial">
    <div className="container">
      <img 
        src={testimonial.avatar} 
        alt="Coach avatar" 
        className="testimonial-avatar"
      />
      <blockquote>
        "{testimonial.quote}"
      </blockquote>
      <cite>
        {testimonial.author}
      </cite>
    </div>
  </section>
);

const Pricing: React.FC<{ pricing: MarketingContent['pricing'] }> = ({ pricing }) => (
  <section id="pricing" className="pricing">
    <div className="container">
      <h3>{pricing.title}</h3>
      <p className="pricing-subtitle">{pricing.subtitle}</p>
      
      <div className="pricing-card">
        <h4>{pricing.planName}</h4>
        <p className="pricing-price">
          {pricing.price}<span>/mo</span>
        </p>
        <p className="pricing-billing">{pricing.billing}</p>
        
        <ul className="pricing-features">
          {[pricing.feature1, pricing.feature2, pricing.feature3, pricing.feature4, pricing.feature5].map((feature, index) => (
            <li key={index}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        
        <a href="#" className="cta-button" style={{ width: '100%', textAlign: 'center' }}>
          {pricing.cta}
        </a>
      </div>
    </div>
  </section>
);

const Footer: React.FC<{ footer: MarketingContent['footer'] }> = ({ footer }) => (
  <footer>
    <div className="container">
      <p>{footer.copyright}</p>
      <div>
        <a href="#">{footer.privacy}</a>
        <a href="#">{footer.terms}</a>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const { content, updateSection, isLoading, isSaving } = useContent();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [editingSection, setEditingSection] = useState<keyof MarketingContent | null>(null);

  const handleAdminClick = () => {
    if (!isAuthenticated) {
      setShowLoginForm(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginForm(false);
  };

  const handleEditSection = (section: keyof MarketingContent) => {
    setEditingSection(section);
  };

  const handleSaveSection = async (section: keyof MarketingContent, data: any) => {
    await updateSection(section, data);
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Admin Mode Overlay */}
      {isAuthenticated && (
        <AdminMode
          onEditSection={handleEditSection}
          isSaving={isSaving}
        />
      )}

      {/* Main Content */}
      <Header
        title={content.header.title}
        navFeatures={content.header.nav.features}
        navPricing={content.header.nav.pricing}
        navLogin={content.header.nav.login}
        ctaText={content.header.cta}
      />
      
      <Hero
        headline={content.hero.headline}
        subtitle={content.hero.subtitle}
        ctaPrimary={content.hero.ctaPrimary}
        ctaSecondary={content.hero.ctaSecondary}
        image={content.hero.image}
      />
      
      <Features
        title={content.features.title}
        subtitle={content.features.subtitle}
        feature1={content.features.feature1}
        feature2={content.features.feature2}
        feature3={content.features.feature3}
      />
      
      <Testimonial testimonial={content.testimonial} />
      
      <Pricing pricing={content.pricing} />
      
      <Footer footer={content.footer} />

      {/* Admin Button (only show if not authenticated) */}
      {!isAuthenticated && (
        <AdminButton onClick={handleAdminClick} />
      )}

      {/* Login Form Modal */}
      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditor
          section={editingSection}
          content={content}
          onSave={handleSaveSection}
          onClose={() => setEditingSection(null)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default App;
