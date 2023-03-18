import {FirebaseService} from '../firebase/firebase.service';
import {Injectable} from '@nestjs/common';
import * as firebase from 'firebase';

@Injectable()
export class DbService {
  private db: firebase.database.Database;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getFirebaseApp().database();
  }

  async query(nodeName: string, orderBy?: string) {
    try {
      const snapshot = await this.db.ref(nodeName).once('value');
      const data = await snapshot.val();
      if (!data) {
        return [];
      }
      const entityArray = [];
      for (const [id, value] of Object.entries(data)) {
        entityArray.push({id, ...(value as object)});
      }
      if (orderBy) {
        entityArray.sort((a, b) => a[orderBy] - b[orderBy]);
      }
      return entityArray;
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
    const childRef = await this.db.ref(`${nodeName}/${key}`);
    try {
      await childRef.remove();
    } catch (err) {
      throw err;
    }
  }

  async deleteAll(nodeName: string) {
    const nodeRef = await this.db.ref(nodeName);
    try {
      await nodeRef.remove();
    } catch (err) {
      throw err;
    }
  }

  async add(nodeName: string, value: any) {
    try {
      const newRef = await this.db.ref(nodeName).push(value);
      return newRef.key;
    } catch (err) {
      throw err;
    }
  }
}
