import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public user?: User;
}
