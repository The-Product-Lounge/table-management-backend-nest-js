import * as admin from 'firebase-admin';

export class FirebaseService {
  private readonly firebaseApp: admin.app.App;

  constructor() {
    if (admin.apps.length === 0) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  getFirebaseApp(): admin.app.App {
    return this.firebaseApp;
  }
}
