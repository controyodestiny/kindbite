import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';

const ImageUpload = ({ 
  onImageUpload, 
  onImageDelete, 
  existingImages = [], 
  foodListingId,
  maxImages = 5 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length + existingImages.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large. Please choose a file smaller than 5MB.`);
        continue;
      }

      await uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('alt_text', file.name);
      formData.append('is_primary', existingImages.length === 0); // First image is primary

      const response = await fetch(
        `http://localhost:8000/api/v1/foods/listings/${foodListingId}/images/upload/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('kindbite_access_token')}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const uploadedImage = await response.json();
      onImageUpload(uploadedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/foods/images/${imageId}/delete/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('kindbite_access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      onImageDelete(imageId);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {existingImages.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.image_url}
                alt={image.alt_text}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Primary
                </div>
              )}
              <button
                onClick={() => deleteImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {existingImages.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">
                {uploading ? 'Uploading...' : 'Upload food images'}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop or click to select images
              </p>
              <p className="text-xs text-gray-400">
                Max {maxImages} images, 5MB each
              </p>
            </div>
            
            <button
              onClick={openFileDialog}
              disabled={uploading}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Choose Images
            </button>
          </div>
        </div>
      )}

      {existingImages.length >= maxImages && (
        <div className="text-center text-sm text-gray-500">
          Maximum {maxImages} images reached
        </div>
      )}
    </div>
  );
};

export default ImageUpload;




