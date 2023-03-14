import { FirebaseService } from './../firebase/firebase.service';
import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase';

@Injectable()
export class DbService {
  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getFirebaseApp().database();
  }

  private db: firebase.database.Database;

  async query(nodeName: string, orderBy?: string) {
    try {
      const snapshot = orderBy
        ? await this.db.ref(nodeName).once('value')
        : await this.db.ref(nodeName).orderByChild(orderBy).once('value');
      const data = snapshot.val();
      return data;
    } catch (err) {
      throw err;
    }
  }

  async update(nodeName: string, key: string, value: any) {
    const updates = {};
    updates[`/${nodeName}/${key}`] = value;
    try {
      await this.db.ref().update(updates);
    } catch (err) {
      throw err;
    }
  }

  async delete(nodeName: string, key: string) {
    const childRef = this.db.ref(`${nodeName}/${key}`);
    try {
      await childRef.remove();
    } catch (err) {
      throw err;
    }
  }

  async deleteAll(nodeName: string) {
    const nodeRef = this.db.ref(nodeName);
    try {
      await nodeRef.remove();
    } catch (err) {
      throw err;
    }
  }

  async add(nodeName: string, value: any) {
    try {
      const nodeRef = this.db.ref(nodeName);
      const newRef = nodeRef.push();
      newRef.set(value);
      return newRef.key;
    } catch (err) {
      throw err;
    }
  }
}
