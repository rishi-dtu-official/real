import React from 'react';

const FirebaseSetupHelper = () => {
  const isDevEnvironment = import.meta.env.DEV;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'localhost:8082';
  
  if (!isDevEnvironment) return null;

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-sm font-semibold text-blue-800 mb-2">🔧 Development Setup</h3>
      <div className="text-xs text-blue-700 space-y-1">
        <p><strong>Current domain:</strong> {currentOrigin}</p>
        <p><strong>Firebase project:</strong> {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not configured'}</p>
        
        <details className="mt-2">
          <summary className="cursor-pointer text-blue-800 font-medium">
            📋 Firebase Console Setup Checklist
          </summary>
          <div className="mt-2 pl-4 space-y-1 text-xs">
            <p>1. ✅ Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></p>
            <p>2. ✅ Select project: <code className="bg-blue-100 px-1 rounded">{import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id'}</code></p>
            <p>3. ✅ Authentication → Settings → Authorized domains</p>
            <p>4. ✅ Add: <code className="bg-blue-100 px-1 rounded">localhost</code></p>
            <p>5. ✅ Authentication → Sign-in method → Enable Google</p>
            <p>6. ✅ Firestore Database → Create database</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default FirebaseSetupHelper;