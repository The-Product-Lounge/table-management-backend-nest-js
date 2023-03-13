import { FirebaseModule } from './../firebase/firebase.module';
import { DbService } from './db.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [DbService],
  exports: [DbService],
  imports: [FirebaseModule],
})
export class DbModule {}
