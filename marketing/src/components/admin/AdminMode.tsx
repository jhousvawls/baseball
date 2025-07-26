import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { MarketingContent } from '../../lib/types';

interface AdminModeProps {
  onEditSection: (section: keyof MarketingContent) => void;
  isSaving: boolean;
}

const AdminMode: React.FC<AdminModeProps> = ({ onEditSection, isSaving }) => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <>
      {/* Admin Header Bar */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 z-40 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <span className="font-medium">Admin Mode</span>
            <span className="text-red-200 text-sm">
              Logged in as {user?.email}
            </span>
            {isSaving && (
              <span className="text-red-200 text-sm">Saving...</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(window.location.href, '_blank')}
              className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm"
            >
              Preview Site
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm"
            >
              Exit Admin
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-12"></div>

      {/* Edit Buttons Overlay */}
      <div className="admin-edit-overlay">
        {/* Header Edit Button */}
        <div className="absolute top-16 left-4 z-30">
          <button
            onClick={() => onEditSection('header')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-lg text-sm font-medium"
          >
            Edit Header
          </button>
        </div>

        {/* Hero Edit Button */}
        <div className="absolute top-32 right-4 z-30">
          <button
            onClick={() => onEditSection('hero')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-lg text-sm font-medium"
          >
            Edit Hero
          </button>
        </div>

        {/* Features Edit Button */}
        <div className="absolute top-96 left-4 z-30">
          <button
            onClick={() => onEditSection('features')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-lg text-sm font-medium"
          >
            Edit Features
          </button>
        </div>

        {/* Testimonial Edit Button */}
        <div className="absolute bottom-96 right-4 z-30">
          <button
            onClick={() => onEditSection('testimonial')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-lg text-sm font-medium"
          >
            Edit Testimonial
          </button>
        </div>

        {/* Pricing Edit Button */}
        <div className="absolute bottom-48 left-4 z-30">
          <button
            onClick={() => onEditSection('pricing')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-lg text-sm font-medium"
          >
            Edit Pricing
          </button>
        </div>

        {/* Footer Edit Button */}
        <div className="absolute bottom-16 right-4 z-30">
          <button
            onClick={() => onEditSection('footer')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-lg text-sm font-medium"
          >
            Edit Footer
          </button>
        </div>
      </div>

    </>
  );
};

export default AdminMode;
