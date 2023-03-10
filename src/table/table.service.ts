import { FirebaseService } from '../firebase/firebase.service';
import { UserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Table, TableDocument } from 'src/schemas/table.schema';
import { TableDto } from './dto';

@Injectable()
export class TableService {
  constructor(
    // @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async getAll(): Promise<Table[]> {
    const db = this.firebaseService.getFirebaseApp().database();
    try {
      const snapshot = await db
        .ref('tables')
        .orderByChild('tableNumber')
        .once('value');
      const data = snapshot.val();
      return data;
    } catch (err) {
      throw err;
    }
  }

  // async getById(id: string): Promise<Table | null> {
  //   const ObjectId = mongoose.Types.ObjectId;
  //   const _id = new ObjectId(id);
  //   //returns an object or null
  //   return this.tableModel.findById(_id);
  // }

  async update(table: any) {
    const db = this.firebaseService.getFirebaseApp().database();
    const updates = {};
    const tableId = Object.keys(table)[0];
    updates[`/tables/${tableId}`] = table[tableId];
    try {
      await db.ref().update(updates);
    } catch (err) {
      throw err;
    }
    //returns number of docs modified
    // return this.tableModel.updateOne({ _id: table._id }, table).exec();
  }

  async delete(id: string) {
    const db = this.firebaseService.getFirebaseApp().database();
    const tableRef = db.ref(`tables/${id}`);
    try {
      await tableRef.remove();
    } catch (err) {
      throw err;
    }
  }

  async deleteAll() {
    const db = this.firebaseService.getFirebaseApp().database();
    const tablesRef = db.ref(`tables`);
    try {
      await tablesRef.remove();
    } catch (err) {
      throw err;
    }
  }

  async joinTable(user: UserDto) {
    const { portfolioStage } = user;
    delete user.portfolioStage;

    const db = this.firebaseService.getFirebaseApp().database();
    const tablesRef = db.ref(`tables`);

    //the first of an array of objects or null
    const table = await tablesRef
      .orderByChild('tableNumber')
      .once('value')
      .then((snapshot) => {
        const tables = [];
        snapshot.forEach((childSnapshot) => {
          const table = childSnapshot.val();
          if (
            table.users &&
            table.users.length < 4 &&
            table.portfolioStage === portfolioStage
          ) {
            tables.push({
              key: childSnapshot.key,
              ...table,
            });
          }
        });
        console.log(tables);

        return tables.length ? tables[0] : null;
      });
    console.log(table);

    if (!table) {
      const tables = await this.getAll();

      let tableNumber = 1;

      for (let tableId in tables) {
        const table = tables[tableId];
        if (table.tableNumber === tableNumber) tableNumber++;
        else break;
      }

      const newTableRef = tablesRef.push();

      newTableRef.set({
        users: [user],
        portfolioStage,
        tableNumber,
      });

      return newTableRef;
    } else {
      const { key } = table;
      delete table.key;
      table.users.push(user);
      const tableToSaveToDb = {
        [key]: {
          ...table,
        },
      };
      await this.update(tableToSaveToDb)
      return tableToSaveToDb;
    }
  }
}
