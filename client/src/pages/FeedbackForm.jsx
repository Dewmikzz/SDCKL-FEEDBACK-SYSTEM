import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiCheckCircle, FiAlertCircle, FiPlus } from 'react-icons/fi';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    rating: 0,
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittingLoader, setSubmittingLoader] = useState(false);

  const categories = [
    'Academic',
    'Facilities',
    'Staff',
    'Services',
    'Technology',
    'Other'
  ];

  useEffect(() => {
    // Simulate loading with preloader - reduced time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please provide a rating';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSubmittingLoader(true);
    setSubmitStatus(null);

    try {
      await axios.post('/api/feedback', formData);
      
      // Show preloader for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmittingLoader(false);
      setSubmitStatus('success');
      setShowSuccess(true);
      
      // Reset form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        rating: 0,
        message: ''
      });
    } catch (error) {
      setSubmittingLoader(false);
      setSubmitStatus('error');
      console.error('Error submitting feedback:', error);
      
      // Log detailed error for debugging
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    setSubmitStatus(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      rating: 0,
      message: ''
    });
    setErrors({});
  };

  // Initial Preloader Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/college_logo.png" 
              alt="SDCKL Logo" 
              className="h-32 w-auto animate-pulse"
            />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading Feedback System...</p>
        </div>
      </div>
    );
  }

  // Submitting Preloader
  if (submittingLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/college_logo.png" 
              alt="SDCKL Logo" 
              className="h-32 w-auto animate-pulse"
            />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700 animate-pulse">Submitting your feedback...</p>
          <p className="text-gray-600 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Success Screen
  if (showSuccess && submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-green-600 text-6xl" />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Thank You for Your Feedback!
            </h2>
            
            <p className="text-lg text-gray-600 mb-2">
              Your feedback has been successfully submitted.
            </p>
            
            <p className="text-base text-gray-500 mb-8">
              We truly appreciate you taking the time to share your thoughts with us. 
              Your input helps us improve and provide better services at Sentral Digital College Kuala Lumpur.
            </p>

            <p className="text-sm text-gray-500 mb-8">
              Our team will review your feedback and take appropriate action. 
              Thank you for helping us serve you better!
            </p>

            {/* Add Another Button */}
            <button
              onClick={handleAddAnother}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              <FiPlus className="text-xl" />
              Add Another Feedback
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-gray-600 text-sm">
              © 2025 Sentral Digital College Kuala Lumpur. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Powered by{' '}
              <a 
                href="https://www.dewmika.rf.gd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                DewX
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4">
            <img 
              src="/college_logo.png" 
              alt="SDCKL Logo" 
              className="h-24 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Sentral Digital College
          </h1>
          <p className="text-lg text-gray-600 font-semibold">Kuala Lumpur</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mt-6">
            Feedback System
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            We value your opinion. Please share your feedback with us.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-center gap-3 transform hover:scale-105 transition-transform shadow-lg">
              <FiAlertCircle className="text-red-600 text-2xl" />
              <p className="text-red-800 font-medium">
                Something went wrong. Please try again.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="transform hover:scale-[1.01] transition-transform duration-200">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 ${
                  errors.name ? 'border-red-500 shadow-lg shadow-red-100' : 'border-gray-300 hover:border-blue-300'
                }`}
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="transform hover:scale-[1.01] transition-transform duration-200">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 ${
                  errors.email ? 'border-red-500 shadow-lg shadow-red-100' : 'border-gray-300 hover:border-blue-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="transform hover:scale-[1.01] transition-transform duration-200">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                placeholder="+60 12-345 6789"
              />
            </div>

            {/* Category */}
            <div className="transform hover:scale-[1.01] transition-transform duration-200">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 ${
                  errors.category ? 'border-red-500 shadow-lg shadow-red-100' : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600 font-medium">{errors.category}</p>}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    className={`w-16 h-16 md:w-18 md:h-18 rounded-full text-3xl transition-all transform hover:scale-125 hover:rotate-12 ${
                      formData.rating >= rating
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-xl scale-110'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300 shadow-md'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              {errors.rating && <p className="mt-3 text-sm text-red-600 font-medium text-center md:text-left">{errors.rating}</p>}
              {formData.rating > 0 && (
                <p className="mt-3 text-sm text-gray-600 font-semibold text-center md:text-left">
                  {formData.rating} out of 5 stars
                </p>
              )}
            </div>

            {/* Message */}
            <div className="transform hover:scale-[1.01] transition-transform duration-200">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 resize-none ${
                  errors.message ? 'border-red-500 shadow-lg shadow-red-100' : 'border-gray-300 hover:border-blue-300'
                }`}
                placeholder="Please share your feedback, suggestions, or concerns..."
              />
              {errors.message && <p className="mt-1 text-sm text-red-600 font-medium">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="text-xl" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-gray-600 text-sm">
            © 2025 Sentral Digital College Kuala Lumpur. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Powered by{' '}
            <a 
              href="https://www.dewmika.rf.gd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              DewX
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
