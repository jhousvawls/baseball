// Type definitions for the marketing site

export interface ContentSection {
  [key: string]: string | ContentSection;
}

export interface MarketingContent {
  header: {
    title: string;
    nav: {
      features: string;
      pricing: string;
      login: string;
    };
    cta: string;
  };
  hero: {
    headline: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image: string;
  };
  features: {
    title: string;
    subtitle: string;
    feature1: {
      title: string;
      description: string;
    };
    feature2: {
      title: string;
      description: string;
    };
    feature3: {
      title: string;
      description: string;
    };
  };
  testimonial: {
    avatar: string;
    quote: string;
    author: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    planName: string;
    price: string;
    billing: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
    feature5: string;
    cta: string;
  };
  footer: {
    copyright: string;
    privacy: string;
    terms: string;
  };
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export type Theme = 'light' | 'dark';
