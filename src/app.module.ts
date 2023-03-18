import {Module} from '@nestjs/common';
import {TableModule} from "./table/table.module";
import {CommonModule} from "./common/common.module";

@Module({
  imports: [
    TableModule,
    CommonModule,
  ],
})
export class AppModule {}
