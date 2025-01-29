import { Ticket } from 'src/modules/ticket/entities/ticket.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  serial_number: string;

  @Column({ unique: true })
  patrimony: string;

  @Column()
  location: string;

  @Column({ default: 'disponivel' })
  status: string; //disponivel, em uso

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Ticket, (ticket) => ticket.devices)
  @JoinTable()
  tickets: Ticket[];
}
