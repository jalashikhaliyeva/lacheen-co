import React, { useState, useEffect } from 'react';
import FileUpload from '../FileUpload';
import { updateHero, fetchSectionData } from '@/firebase/services/settingsService';
import { toast } from 'react-hot-toast';

const HeroSection = () => {
  const [loading, setLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('az');
  const [existingData, setExistingData] = useState({
    images: [],
    video: null,
  });
  const [formData, setFormData] = useState({
    images: [],
    video: null,
    // Multilingual fields
    discountQuantity: {
      az: '',
      ru: ''
    },
    discountReason: {
      az: '',
      ru: ''
    },
    discountDescription: {
      az: '',
      ru: ''
    }
  });

  // State for file previews
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);

  const languages = [
    { code: 'az', name: 'Azərbaycan' },
    { code: 'ru', name: 'English' }
  ];

  useEffect(() => {
    const loadData = async () => {  
      try {
        const data = await fetchSectionData('hero');
        if (data) {
          // Set existing media data
          setExistingData({
            images: data.images || [],
            video: data.video || null,
          });

          // Set form data
          setFormData(prev => ({
            ...prev,
            // Handle both old single-language format and new multilingual format
            discountQuantity: {
              az: data.discountQuantity?.az || data.discountQuantity || '',
              ru: data.discountQuantity?.ru || data.discountQuantity || ''
            },
            discountReason: {
              az: data.discountReason?.az || data.discountReason || '',
              ru: data.discountReason?.ru || data.discountReason || ''
            },
            discountDescription: {
              az: data.discountDescription?.az || data.discountDescription || '',
              ru: data.discountDescription?.ru || data.discountDescription || ''
            }
          }));
        }
      } catch (error) {
        console.error('Error loading hero data:', error);
        toast.error('Failed to load hero section data');
      }
    };

    loadData();
  }, []);

  // Function to create file previews
  const createFilePreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({
        file,
        url: e.target.result,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (files) => {
    setFormData(prev => ({ ...prev, images: files }));
    
    // Create previews for new images
    if (files && files.length > 0) {
      const previews = await Promise.all(files.map(createFilePreview));
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
  };

  const handleVideoChange = async (files) => {
    const videoFile = files[0];
    setFormData(prev => ({ ...prev, video: videoFile }));
    
    // Create preview for new video
    if (videoFile) {
      const preview = await createFilePreview(videoFile);
      setVideoPreview(preview);
    } else {
      setVideoPreview(null);
    }
  };

  const handleInputChange = (e, language) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [language]: value
      }
    }));
  };

  const removeImagePreview = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newFiles = Array.from(formData.images).filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setFormData(prev => ({ ...prev, images: newFiles }));
  };

  const removeVideoPreview = () => {
    setVideoPreview(null);
    setFormData(prev => ({ ...prev, video: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for backend with multilingual structure
      const dataToSend = {
        images: formData.images.length > 0 ? formData.images : undefined,
        video: formData.video || undefined,
        discountQuantity: formData.discountQuantity,
        discountReason: formData.discountReason,
        discountDescription: formData.discountDescription
      };

      await updateHero(dataToSend);
      toast.success('Hero section updated successfully');
      
      // Reload data to show updated content
      const updatedData = await fetchSectionData('hero');
      if (updatedData) {
        setExistingData({
          images: updatedData.images || [],
          video: updatedData.video || null,
        });
        // Clear previews after successful upload
        setImagePreviews([]);
        setVideoPreview(null);
      }
    } catch (error) {
      toast.error('Failed to update hero section');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderLanguageField = (fieldName, fieldType = 'input', placeholder = '') => {
    const currentLang = languages.find(lang => lang.code === activeLanguage);
    
    return (
      <div>
        {fieldType === 'textarea' ? (
          <textarea
            name={fieldName}
            rows={3}
            value={formData[fieldName][activeLanguage]}
            onChange={(e) => handleInputChange(e, activeLanguage)}
            className="block w-full rounded-lg py-3 px-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 resize-none"
            placeholder={`${placeholder} (${currentLang.name})`}
          />
        ) : (
          <input
            type="text"
            name={fieldName}
            value={formData[fieldName][activeLanguage]}
            onChange={(e) => handleInputChange(e, activeLanguage)}
            className="block w-full rounded-lg py-3 px-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
            placeholder={`${placeholder} (${currentLang.name})`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Language Tab Selector */}
      <div className="bg-white w-fit rounded-lg shadow-sm border border-gray-200 p-1">
        <nav className="flex space-x-1">
          {languages.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLanguage(lang.code)}
              className={`flex-1 py-2 px-16 text-sm font-medium rounded-md transition-all duration-200 ${
                activeLanguage === lang.code
                  ? 'bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 cursor-pointer text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 cursor-pointer'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Display existing media */}
      {(existingData.images.length > 0 || existingData.video) && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-amber-800">Currently Published</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing Images */}
            {existingData.images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-amber-700 mb-3">
                  Images ({existingData.images.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {existingData.images.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={imageUrl} 
                        alt={`Hero image ${index + 1}`}
                        className="w-full h-44 object-cover rounded-lg border border-amber-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Video */}
            {existingData.video && (
              <div>
                <h4 className="text-sm font-medium text-amber-700 mb-3">Video</h4>
                <video 
                  src={existingData.video} 
                  className="w-full h-44 object-cover rounded-lg border border-amber-200"
                  controls
                />
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <FileUpload
              label="Upload Images (2 required)"
              accept="image/*"
              multiple={true}
              maxFiles={2}
              onFileChange={handleImageChange}
            />
            
            {/* Image Previews - Directly under upload */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Selected Images ({imagePreviews.length}/2)
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <img 
                        src={preview.url} 
                        alt={preview.name}
                        className="w-16 h-16 object-cover rounded-md border border-gray-300 flex-shrink-0"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {preview.name}
                        </p>
                        <p className="text-xs text-gray-500">{preview.size}</p>
                      </div>
                 
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Video Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <FileUpload
              label="Upload Video"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/*"
              onFileChange={handleVideoChange}
            />
            
            {/* Video Preview - Directly under upload */}
            {videoPreview && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">Selected Video</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center">
                    <video 
                      src={videoPreview.url} 
                      className="w-20 h-16 object-cover rounded-md border border-gray-300 flex-shrink-0"
                      muted
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {videoPreview.name}
                      </p>
                      <p className="text-xs text-gray-500">{videoPreview.size}</p>
                    </div>
                  
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Fields */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Content - {languages.find(l => l.code === activeLanguage)?.name}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Quantity
              </label>
              {renderLanguageField('discountQuantity', 'input', 'e.g., 20% off')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Discount
              </label>
              {renderLanguageField('discountReason', 'input', 'e.g., Summer Sale')}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Description
              </label>
              {renderLanguageField('discountDescription', 'textarea', 'Describe the discount details...')}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 cursor-pointer text-white font-medium rounded-lg shadow-sm hover:bg-emerald-700 focus:outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroSection;