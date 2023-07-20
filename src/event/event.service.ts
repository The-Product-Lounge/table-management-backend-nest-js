import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DbService } from 'src/common/db/db.service';

@Injectable()
export class EventService {
  constructor(private readonly dbService: DbService) {}

  async create(createEventDto: CreateEventDto) {
    await this.dbService.add('events', createEventDto);
    return 'This action adds a new event';
  }

  findAll() {
    return this.dbService.query('events');
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    this.dbService.update('events', id, updateEventDto);
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
