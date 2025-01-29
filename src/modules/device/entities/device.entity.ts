import { Ticket } from 'src/modules/ticket/entities/ticket.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  serial_number: string;

  @Column()
  patrimony: string;

  @Column()
  location: string;

  @Column()
  status: string; //disponivel, em uso

  @ManyToMany(() => Ticket, (ticket) => ticket.devices)
  @JoinTable()
  tickets: Ticket[];
}
