import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { MarketingContent } from '../lib/types';

// Default content as fallback
const defaultContent: MarketingContent = {
  header: {
    title: "Coach's Dugout",
    nav: {
      features: "Features",
      pricing: "Pricing",
      login: "Login"
    },
    cta: "Get Started"
  },
  hero: {
    headline: "Stop Guessing. Start Coaching.",
    subtitle: "The all-in-one practice planner designed for youth baseball. Spend less time planning and more time developing young players with AI-powered drills, video guides, and seamless team collaboration.",
    ctaPrimary: "Start Your Free Trial",
    ctaSecondary: "Learn More",
    image: "https://baseball-practice-generator.web.app/app"
  },
  features: {
    title: "Everything You Need to Run a Great Practice",
    subtitle: "From AI assistance to multi-coach collaboration, we've got you covered.",
    feature1: {
      title: "AI Coach Assistant",
      description: "Team struggling with a skill? Describe the problem and get instant, age-appropriate drill suggestions, complete with video links."
    },
    feature2: {
      title: "Multi-Coach Collaboration",
      description: "Invite your entire coaching staff. Edit practice plans together in real-time and see an activity log of all changes."
    },
    feature3: {
      title: "Smart Video Finder",
      description: "Stop endless searching. Our tool finds the best youth-appropriate drill videos from YouTube, so your parent-coaches are always prepared."
    }
  },
  testimonial: {
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    quote: "Coach's Dugout has been a game-changer. I save hours every week on planning, and our practices have never been more effective. The AI assistant is like having a pro coach in my pocket.",
    author: "- John, Braves 6U Head Coach"
  },
  pricing: {
    title: "Simple, Affordable Pricing",
    subtitle: "One plan. All features. No hidden fees. Get everything you need to run your team like a pro.",
    planName: "Team Plan",
    price: "$10",
    billing: "Billed annually ($120/year)",
    feature1: "Up to 8 Coaches",
    feature2: "Unlimited Practice Plans",
    feature3: "Full AI Coach Assistant",
    feature4: "Smart Video Finder",
    feature5: "Team Roster & Schedule",
    cta: "Start 14-Day Free Trial"
  },
  footer: {
    copyright: "© 2025 Coach's Dugout. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service"
  }
};

export const useContent = () => {
  const [content, setContent] = useState<MarketingContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load content from Firestore
  useEffect(() => {
    const contentRef = doc(db, 'marketing_content', 'main_content');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      contentRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data.content) {
            setContent(data.content);
          }
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading content:', error);
        setError('Failed to load content');
        setIsLoading(false);
        // Use default content on error
        setContent(defaultContent);
      }
    );

    return () => unsubscribe();
  }, []);

  // Save content to Firestore
  const saveContent = async (newContent: MarketingContent) => {
    setIsSaving(true);
    setError(null);
    
    try {
      const contentRef = doc(db, 'marketing_content', 'main_content');
      await setDoc(contentRef, {
        content: newContent,
        lastModified: new Date(),
        version: 1
      });
      
      setContent(newContent);
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Failed to save content');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Update specific section
  const updateSection = async (sectionKey: keyof MarketingContent, sectionData: any) => {
    const newContent = {
      ...content,
      [sectionKey]: sectionData
    };
    await saveContent(newContent);
  };

  return {
    content,
    setContent,
    saveContent,
    updateSection,
    isLoading,
    isSaving,
    error
  };
};
