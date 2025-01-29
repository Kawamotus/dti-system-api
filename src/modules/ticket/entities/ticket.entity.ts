import { Device } from 'src/modules/device/entities/device.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  status: string; //concluido, trabalhando, ainda nao visto

  @Column()
  read: boolean;

  @Column()
  priority_level: string; //prioridade - alta, baixa, media

  @Column()
  picture: string;

  @Column()
  terminal: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Device, (device) => device.tickets)
  devices: Device[];
}
