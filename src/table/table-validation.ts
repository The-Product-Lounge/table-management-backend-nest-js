import { UserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TableValidation {
  isArrayOfUsers(arr: any[]): arr is UserDto[] {
    return (
      Array.isArray(arr) &&
      arr.every((item) => {
        return (
          typeof item.firstName === 'string' &&
          typeof item.lastName === 'string' &&
          typeof item.imgUrl === 'string' &&
          typeof item.id === 'string'
        );
        // add checks for other properties if needed
      })
    );
  }

  hasExpectedProperties(obj: object): boolean {
    const objKeys = Object.keys(obj);
    if (objKeys.length !== 1) {
      return false;
    }

    const table = obj[objKeys[0]];

    const expectedKeys = ['portfolioStage', 'tableNumber', 'users'];
    const tableKeys = Object.keys(table);

    if (tableKeys.length !== expectedKeys.length) {
      return false;
    }

    for (const key of tableKeys) {
      if (!expectedKeys.includes(key)) {
        return false;
      }
    }

    if (!this.isArrayOfUsers(table.users)) return false;

    return true
  }
}
