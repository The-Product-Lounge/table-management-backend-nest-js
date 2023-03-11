import { FirebaseService } from './../firebase/firebase.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async query(nodeName: string, orderBy?: string) {
    const db = this.firebaseService.getFirebaseApp().database();
    const snapshot = orderBy
      ? await db.ref(nodeName).once('value')
      : await db.ref(nodeName).orderByChild(orderBy).once('value');
    const data = snapshot.val();
    return data;
  }

  async update(nodeName: string, key: string, value: any) {
    const db = this.firebaseService.getFirebaseApp().database();
    const updates = {};
    updates[`/${nodeName}/${key}`] = value;
    try {
      await db.ref().update(updates);
    } catch (err) {
      throw err;
    }
  }

  async delete(nodeName: string, key: string) {
    const db = this.firebaseService.getFirebaseApp().database();
    const childRef = db.ref(`${nodeName}/${key}`);
    try {
      await childRef.remove();
    } catch (err) {
      throw err;
    }
  }

  async deleteAll(nodeName: string) {
    console.log(nodeName);
    
    const db = this.firebaseService.getFirebaseApp().database();
    const nodeRef = db.ref(nodeName);
    try {
      await nodeRef.remove();
    } catch (err) {
      throw err;
    }
  }

  async add(nodeName: string, value: any) {
    const db = this.firebaseService.getFirebaseApp().database();
    const nodeRef = db.ref(nodeName);

    const newRef = nodeRef.push();

    newRef.set(value);

    return newRef.key;
  }
}
