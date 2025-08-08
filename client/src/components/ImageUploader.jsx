
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AppLayout.css';
import '../styles/ImageUpload.css';

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an image file first.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('http://localhost:5000/api/ocr', formData);
      setResult(res.data.answer);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Image Upload & OCR</h1>
        <p className="page-description">
          Upload images with text or diagrams to extract and analyze content
        </p>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">Upload Image</h2>
        </div>
        
        <div className="form-group">
          <label htmlFor="image" className="form-label">Select Image</label>
          <input
            type="file"
            id="image"
            className="form-input"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>

        {preview && (
          <div className="form-group">
            <label className="form-label">Preview</label>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)'
              }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="auth-button"
          style={{ marginBottom: 'var(--spacing-lg)' }}
        >
          {loading ? 'Processing...' : 'Process Image'}
        </button>

        {result && (
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Extracted Content</h3>
            </div>
            <div style={{ 
              padding: 'var(--spacing-md)', 
              backgroundColor: 'var(--background-secondary)',
              borderRadius: 'var(--radius-md)',
              whiteSpace: 'pre-wrap'
            }}>
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
