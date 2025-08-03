'use client';

import { useEffect, useState } from 'react';

interface AHPRegistrationProps {
  buttonText?: string;
  className?: string;
}

/**
 * AHP Registration Button Component
 * 
 * This component renders a button that triggers the AHP Module 2.0 registration modal
 * when clicked. It checks if the AHP Module is loaded before attempting to show the modal.
 */
export default function AHPRegistration({ 
  buttonText = "Subscribe to AI Visibility Reports", 
  className = "" 
}: AHPRegistrationProps) {
  const [isModuleLoaded, setIsModuleLoaded] = useState(false);

  useEffect(() => {
    // Check if AHP Module is loaded
    const checkModuleLoaded = () => {
      if (window.AHPModule && typeof window.AHPModule.showRegistration === 'function') {
        setIsModuleLoaded(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (!checkModuleLoaded()) {
      // If not loaded, check every 500ms for up to 10 seconds
      const interval = setInterval(() => {
        if (checkModuleLoaded()) {
          clearInterval(interval);
        }
      }, 500);
      
      // Clean up interval after 10 seconds if module never loads
      setTimeout(() => clearInterval(interval), 10000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const handleShowModal = () => {
    if (window.AHPModule && typeof window.AHPModule.showRegistration === 'function') {
      window.AHPModule.showRegistration();
    } else {
      console.warn('AHP Module is not loaded yet. Please try again in a moment.');
      alert('AI Visibility Report registration is not available at the moment. Please try again later.');
    }
  };

  return (
    <button
      onClick={handleShowModal}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors ${className}`}
      disabled={!isModuleLoaded}
    >
      {buttonText}
      {!isModuleLoaded && <span className="ml-2 inline-block animate-pulse">...</span>}
    </button>
  );
}

// Add TypeScript declaration for the AHP Module
declare global {
  interface Window {
    AHPModule?: {
      showRegistration: () => void;
    };
  }
}
