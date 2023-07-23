import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DbService } from 'src/common/db/db.service';

@Injectable()
export class EventService {
  constructor(private readonly dbService: DbService) {}

  async create(createEventDto: CreateEventDto) {
    console.log('create event ', createEventDto);
    await this.dbService.add('events', createEventDto);
    return 'This action adds a new event';
  }

  findAll() {
    return this.dbService.query('events');
  }

  findOne(id: string) {
    return this.dbService.simpleQuery(`events/${id}`);
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    console.log('update event ', id, ' with ', updateEventDto);
    await this.dbService.update('events', id, updateEventDto);
    return `This action updates a #${id} event`;
  }

  async remove(id: string) {
    console.log('remove event ', id);
    const event = await this.findOne(id);
    if (!event) {
      return `There is not event with id #${id}`;
    }
    event.tableIds?.map(async (tableId) => {
      const table = await this.dbService.delete(`tables`, tableId);
      console.log('deleted table ', table);
    });
    this.dbService.delete('events', id);
    this.dbService.delete('uuids', id);
    return `This action removes a #${id} event`;
  }

  async removeTables(id: string) {
    const event = await this.dbService.simpleQuery(`events/${id}`);
    if (!event.tableIds) {
      return `There is not tables in #${id} event`;
    }
    delete event.loungersNum;
    event.tableIds.map(async (tableId) => {
      const table = await this.dbService.delete(`tables`, tableId);
      console.log('deleted table ', table);
    });
    event.tableIds = [];
    await this.dbService.delete(`uuids`, id);
    await this.dbService.update(`events`, id, event);
    return `This action removes all tables from #${id} event`;
  }
}
