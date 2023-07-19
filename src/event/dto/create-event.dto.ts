import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Timestamp } from 'firebase/firestore';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Transform(({ value }) => Timestamp.fromDate(new Date(value)))
  date: Timestamp;

  @Transform(({ value }) => Timestamp.fromDate(new Date(value)))
  time: Timestamp;

  @IsString()
  location: string;

  @IsString()
  details: string;

  @IsString()
  wifiName: string;

  @IsString()
  wifiPassword: string;

  @IsString()
  @Transform(
    ({ value }) =>
      value ||
      'https://res.cloudinary.com/the-product-lounge/image/upload/v1689776229/img_icon_npfstv_wemuvh.png',
  )
  logoImgUrl: string;

  @IsString()
  backgroundImgUrl: string;
}
