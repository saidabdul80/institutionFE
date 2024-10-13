// src/globals.d.ts

// Import the abilities object
import endpointRoutes from './src/stores/endpointRoutes';

// Extend the Vue namespace to include global properties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $endpoints: typeof endpointRoutes;
  }
}

// Extend the Window interface to include global properties if needed
declare global {
  interface Window {
    // Add any other global properties you might have
  }
}

export {};
