import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { Identyficable } from '../../common/interfaces/identyficable';

@Entity()
export class User implements Identyficable {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public username: string;

  @Column({ select: false })
  public password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  // Relations

  @OneToMany(
    () => Playlist,
    playlist => playlist.user,
    { onDelete: 'CASCADE' },
  )
  public playlists: Playlist[];
}
