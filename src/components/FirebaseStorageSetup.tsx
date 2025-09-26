import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FirebaseStorageSetup = () => {
  const [showSetup, setShowSetup] = useState(false);

  if (!import.meta.env.DEV) return null;

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center">
          ⚠️ Firebase Storage Setup Required
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSetup(!showSetup)}
            className="ml-auto text-orange-600 hover:text-orange-800"
          >
            {showSetup ? 'Hide' : 'Show'} Setup
          </Button>
        </CardTitle>
      </CardHeader>
      
      {showSetup && (
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>CORS Error Fix:</strong> Your Firebase Storage needs to be configured to allow uploads from this domain.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Step 1: Firebase Console Storage Rules</h4>
              <ol className="list-decimal list-inside space-y-1 text-orange-700">
                <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                <li>Select your project: <code className="bg-orange-100 px-1 rounded">{import.meta.env.VITE_FIREBASE_PROJECT_ID}</code></li>
                <li>Go to <strong>Storage</strong> → <strong>Rules</strong></li>
                <li>Update rules to allow authenticated uploads:</li>
              </ol>
              
              <div className="mt-2 p-3 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                <pre>{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}</pre>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Step 2: CORS Configuration</h4>
              <p className="text-orange-700 mb-2">Create a <code>cors.json</code> file:</p>
              
              <div className="p-3 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                <pre>{`[
  {
    "origin": ["http://localhost:8080", "http://localhost:8081", "http://localhost:8082", "https://your-domain.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]`}</pre>
              </div>
              
              <p className="text-orange-700 mt-2 text-xs">
                Then run: <code className="bg-orange-100 px-1 rounded">gsutil cors set cors.json gs://your-bucket-name</code>
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Step 3: Alternative - Use Firebase Admin SDK</h4>
              <p className="text-orange-700 text-xs">
                For production, consider using Firebase Admin SDK on your backend to handle uploads server-side and avoid CORS issues entirely.
              </p>
            </div>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              <strong>Quick Test:</strong> After making changes, wait 5-10 minutes for propagation, then try uploading again.
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default FirebaseStorageSetup;