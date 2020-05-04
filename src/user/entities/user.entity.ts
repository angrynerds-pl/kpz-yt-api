import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { Identifiable } from '../../common/interfaces/identifiable';

@Entity()
export class User implements Identifiable {
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
    { onDelete: 'CASCADE'},
  )
  public playlists: Playlist[];
}
