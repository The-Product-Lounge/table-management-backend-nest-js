import {Global, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppConfigService} from "./app-config/app-config.service";
import {FirebaseModule} from "./firebase/firebase.module";
import {DbModule} from "./db/db.module";
import {BullModule} from "@nestjs/bull";

@Global()
@Module({
  imports: [
    FirebaseModule,
    DbModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/configurations/${process.env.NODE_ENV}.env`,
      ignoreEnvFile: process.env.NODE_ENV !== 'development',
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      useFactory: (configService: AppConfigService) => ({
        redis: configService.config.redis,
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService, FirebaseModule, DbModule],
})
export class CommonModule {
}
