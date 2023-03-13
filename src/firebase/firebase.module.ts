import { FirebaseService } from './firebase.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
