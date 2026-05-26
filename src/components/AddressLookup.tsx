import React, { useRef, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface AddressLookupProps {
  onPlaceSelect: (place: google.maps.places.Place) => void;
  className?: string;
  placeholder?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-autocomplete': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

const AddressLookup: React.FC<AddressLookupProps> = ({ onPlaceSelect, className, placeholder }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib || !containerRef.current || !hasValidKey) return;

    // Create the element imperatively as per CF8
    const autocompleteElement = document.createElement('gmp-place-autocomplete');
    (autocompleteElement as any).placeholder = placeholder || 'Search for your business address...';
    
    // Bias towards Aba, Nigeria (5.1054, 7.3671)
    (autocompleteElement as any).locationBias = {
      center: { lat: 5.1054, lng: 7.3671 },
      radius: 10000 // 10km radius
    };

    // Add event listener for place selection
    autocompleteElement.addEventListener('gmp-place-select', (event: any) => {
      const place = event.detail.place;
      if (place) {
        onPlaceSelect(place);
      }
    });

    // Style the inner input to match the app theme
    const style = document.createElement('style');
    style.textContent = `
      input {
        width: 100%;
        padding: 1.25rem;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1.5rem;
        color: white;
        font-family: inherit;
        font-size: 0.875rem;
        outline: none;
      }
      input:focus {
        border-color: var(--aba-gold);
      }
    `;
    autocompleteElement.appendChild(style);

    containerRef.current.appendChild(autocompleteElement);
    autocompleteRef.current = autocompleteElement;

    const currentContainer = containerRef.current;
    return () => {
      if (currentContainer && autocompleteElement) {
        currentContainer.removeChild(autocompleteElement);
      }
    };
  }, [placesLib, onPlaceSelect, placeholder]);

  if (!placesLib || !hasValidKey) {
    return (
      <input 
        type="text"
        placeholder={placeholder || "Enter business address..."}
        className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl text-sm focus:border-aba-gold outline-none transition-colors"
        onChange={(e) => {
          // Minimal mock of a place object for the parent
          onPlaceSelect({
            formattedAddress: e.target.value,
            location: null
          } as any);
        }}
      />
    );
  }

  return (
    <div ref={containerRef} className={className} />
  );
};

export default AddressLookup;
