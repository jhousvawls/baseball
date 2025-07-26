import React, { useState, useEffect } from 'react';
import type { MarketingContent } from '../../lib/types';

interface SectionEditorProps {
  section: keyof MarketingContent;
  content: MarketingContent;
  onSave: (section: keyof MarketingContent, data: any) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  content,
  onSave,
  onClose,
  isSaving
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData(content[section]);
  }, [section, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(section, formData);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const updateField = (path: string, value: string) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const getFieldValue = (path: string): string => {
    const keys = path.split('.');
    let current = formData;
    
    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = current[key];
      } else {
        return '';
      }
    }
    
    return current || '';
  };

  const renderHeaderEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Title
        </label>
        <input
          type="text"
          value={getFieldValue('title')}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Features Nav Label
        </label>
        <input
          type="text"
          value={getFieldValue('nav.features')}
          onChange={(e) => updateField('nav.features', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pricing Nav Label
        </label>
        <input
          type="text"
          value={getFieldValue('nav.pricing')}
          onChange={(e) => updateField('nav.pricing', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Login Nav Label
        </label>
        <input
          type="text"
          value={getFieldValue('nav.login')}
          onChange={(e) => updateField('nav.login', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CTA Button Text
        </label>
        <input
          type="text"
          value={getFieldValue('cta')}
          onChange={(e) => updateField('cta', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderHeroEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Headline
        </label>
        <input
          type="text"
          value={getFieldValue('headline')}
          onChange={(e) => updateField('headline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle
        </label>
        <textarea
          value={getFieldValue('subtitle')}
          onChange={(e) => updateField('subtitle', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Primary CTA Button
        </label>
        <input
          type="text"
          value={getFieldValue('ctaPrimary')}
          onChange={(e) => updateField('ctaPrimary', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Secondary CTA Button
        </label>
        <input
          type="text"
          value={getFieldValue('ctaSecondary')}
          onChange={(e) => updateField('ctaSecondary', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hero Image URL
        </label>
        <input
          type="url"
          value={getFieldValue('image')}
          onChange={(e) => updateField('image', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );

  const renderFeaturesEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section Title
        </label>
        <input
          type="text"
          value={getFieldValue('title')}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section Subtitle
        </label>
        <input
          type="text"
          value={getFieldValue('subtitle')}
          onChange={(e) => updateField('subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Feature 1 */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Feature 1</h4>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Feature Title"
            value={getFieldValue('feature1.title')}
            onChange={(e) => updateField('feature1.title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Feature Description"
            value={getFieldValue('feature1.description')}
            onChange={(e) => updateField('feature1.description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Feature 2 */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Feature 2</h4>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Feature Title"
            value={getFieldValue('feature2.title')}
            onChange={(e) => updateField('feature2.title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Feature Description"
            value={getFieldValue('feature2.description')}
            onChange={(e) => updateField('feature2.description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Feature 3 */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Feature 3</h4>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Feature Title"
            value={getFieldValue('feature3.title')}
            onChange={(e) => updateField('feature3.title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Feature Description"
            value={getFieldValue('feature3.description')}
            onChange={(e) => updateField('feature3.description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderTestimonialEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Avatar Image URL
        </label>
        <input
          type="url"
          value={getFieldValue('avatar')}
          onChange={(e) => updateField('avatar', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quote
        </label>
        <textarea
          value={getFieldValue('quote')}
          onChange={(e) => updateField('quote', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Author
        </label>
        <input
          type="text"
          value={getFieldValue('author')}
          onChange={(e) => updateField('author', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="- John, Braves 6U Head Coach"
        />
      </div>
    </div>
  );

  const renderPricingEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section Title
        </label>
        <input
          type="text"
          value={getFieldValue('title')}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section Subtitle
        </label>
        <input
          type="text"
          value={getFieldValue('subtitle')}
          onChange={(e) => updateField('subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plan Name
        </label>
        <input
          type="text"
          value={getFieldValue('planName')}
          onChange={(e) => updateField('planName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <input
          type="text"
          value={getFieldValue('price')}
          onChange={(e) => updateField('price', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="$10"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Billing Info
        </label>
        <input
          type="text"
          value={getFieldValue('billing')}
          onChange={(e) => updateField('billing', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CTA Button Text
        </label>
        <input
          type="text"
          value={getFieldValue('cta')}
          onChange={(e) => updateField('cta', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Features */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Plan Features</h4>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <input
              key={num}
              type="text"
              placeholder={`Feature ${num}`}
              value={getFieldValue(`feature${num}`)}
              onChange={(e) => updateField(`feature${num}`, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderFooterEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Copyright Text
        </label>
        <input
          type="text"
          value={getFieldValue('copyright')}
          onChange={(e) => updateField('copyright', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Privacy Policy Link Text
        </label>
        <input
          type="text"
          value={getFieldValue('privacy')}
          onChange={(e) => updateField('privacy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Terms of Service Link Text
        </label>
        <input
          type="text"
          value={getFieldValue('terms')}
          onChange={(e) => updateField('terms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (section) {
      case 'header':
        return renderHeaderEditor();
      case 'hero':
        return renderHeroEditor();
      case 'features':
        return renderFeaturesEditor();
      case 'testimonial':
        return renderTestimonialEditor();
      case 'pricing':
        return renderPricingEditor();
      case 'footer':
        return renderFooterEditor();
      default:
        return <div>Unknown section</div>;
    }
  };

  const getSectionTitle = () => {
    const titles = {
      header: 'Header',
      hero: 'Hero Section',
      features: 'Features Section',
      testimonial: 'Testimonial',
      pricing: 'Pricing Section',
      footer: 'Footer'
    };
    return titles[section] || section;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Edit {getSectionTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {renderEditor()}
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionEditor;
