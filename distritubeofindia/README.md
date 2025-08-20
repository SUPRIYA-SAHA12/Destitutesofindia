# destitutesofindia.com

Mobile-friendly React + Vite app with Firebase Auth (Google + Anonymous), Firestore, and Storage.

## Setup

1) Copy env example and fill your Firebase config (from Firebase Console → Project settings):

```
cp .env.local.example .env.local
```

`.env.local` keys (prefix VITE_ is required):

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

2) Enable in Firebase Console:
- Authentication: Google + Anonymous
- Firestore
- Storage

3) Install and run

```
npm install
npm run dev
```

## Firestore Security Rules (starter)

Adjust before production:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true; // public feed
      allow create: if request.auth != null
                    && request.resource.data.imageUrl is string
                    && request.resource.data.location.lat is number
                    && request.resource.data.location.lng is number
                    && request.resource.data.createdAt == request.time;
    }
  }
}
```

## Storage Security Rules (starter)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{allPaths=**} {
      allow read: if true; // images are public
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deployment

- Frontend: build with `npm run build` and deploy `dist/` to Hostinger.
- Database/Storage: resides in Firebase/Google Cloud.

## Notes

- If you see 400 errors like INVALID_API_KEY or YOUR_PROJECT_ID in URLs, ensure `.env.local` values are set and restart dev server.
