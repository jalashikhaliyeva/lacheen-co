import React, { useState, useEffect } from 'react';
import FileUpload from '../FileUpload';
import { updateAttitude, fetchSectionData } from '@/firebase/services/settingsService';
import { toast } from 'react-hot-toast';

const AttitudeSection = () => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [existingData, setExistingData] = useState({
    image: null,
    video: null
  });
  const [formData, setFormData] = useState({
    image: null,
    video: null
  });

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      try {
        const data = await fetchSectionData('attitude');
        if (data) {
          setExistingData({
            image: data.image || null,
            video: data.video || null
          });
          // toast.success('Attitude data loaded');
        }
      } catch (error) {
        console.error('Error loading attitude data:', error);
        toast.error('Failed to load attitude section data');
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  const handleImageChange = (files) => {
    setFormData(prev => ({ ...prev, image: files[0] }));
  };

  const handleVideoChange = (files) => {
    setFormData(prev => ({ ...prev, video: files[0] }));
  };

  const handleRemoveExistingImage = () => {
    setExistingData(prev => ({ ...prev, image: null }));
  };

  const handleRemoveExistingVideo = () => {
    setExistingData(prev => ({ ...prev, video: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Include existing data that wasn't removed
      const submitData = {
        ...formData,
        existingImage: existingData.image,
      existingVideo: existingData.video
      };
      
      await updateAttitude(submitData);
      toast.success('Attitude section updated successfully');
      
      // Refresh the data after successful update
      const updatedData = await fetchSectionData('attitude');
      if (updatedData) {
        setExistingData({
          image: updatedData.image || null,
          video: updatedData.video || null
        });
        setFormData({ image: null, video: null });
      }
    } catch (error) {
      toast.error('Failed to update attitude section');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading attitude data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Existing Media Preview */}
      {(existingData.image || existingData.video) && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing Image */}
            {existingData.image && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Image</h4>
                <div className="relative group">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={existingData.image}
                      alt="Attitude section image"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJMMTEgMTRMMTUgMTBNMjEgMTJDMjEgMTYuOTcwNiAxNi45NzA2IDIxIDEyIDIxQzcuMDI5NDQgMjEgMyAxNi45NzA2IDMgMTJDMyA3LjAyOTQ0IDcuMDI5NDQgMyAxMiAzQzE2Ljk3MDYgMyAyMSA3LjAyOTQ0IDIxIDEyWiIgc3Ryb2tlPSIjOTNBM0I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveExistingImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Existing Video */}
            {existingData.video && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Video</h4>
                <div className="relative group">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <video
                      src={existingData.video}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveExistingVideo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    title="Remove video"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FileUpload
            label={`Upload Image ${existingData.image ? '(Replace existing)' : ''}`}
            accept="image/*"
            onFileChange={handleImageChange}
          />
          {existingData.image && !formData.image && (
            <p className="mt-2 text-sm text-gray-500">
              Leave empty to keep existing image
            </p>
          )}
        </div>
        
        <div>
          <FileUpload
            label={`Upload Video ${existingData.video ? '(Replace existing)' : ''}`}
            accept="video/*"
            onFileChange={handleVideoChange}
          />
          {existingData.video && !formData.video && (
            <p className="mt-2 text-sm text-gray-500">
              Leave empty to keep existing video
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent cursor-pointer bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default AttitudeSection;