import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PlaylistItem } from '../../playlist-item/entities/playlist-item.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  public name: string;

  // Relations

  @ManyToOne(
    type => User,
    user => user.playlists,
    { onDelete: 'CASCADE' },
  )
  public user: User;

  @OneToMany(
    type => PlaylistItem,
    playlistItem => playlistItem.playlist,
    { onDelete: 'CASCADE' },
  )
  public playlistItem: PlaylistItem[];
}
