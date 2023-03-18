import * as admin from 'firebase-admin';
import {AppConfigService} from "../app-config/app-config.service";
import {Injectable} from "@nestjs/common";

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: admin.app.App;

  constructor(private appConfigService: AppConfigService) {
    if (admin.apps.length === 0) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.appConfigService.config.firebase.projectId,
          clientEmail: this.appConfigService.config.firebase.clientEmail,
          privateKey: this.appConfigService.config.firebase.privateKey,
        }),
        databaseURL: this.appConfigService.config.firebase.url,
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  getFirebaseApp(): admin.app.App {
    return this.firebaseApp;
  }
}
