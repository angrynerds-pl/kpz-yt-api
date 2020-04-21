import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PlaylistItem } from '../../playlist-item/entities/playlist-item.entity';
import { Identifiable } from '../../common/interfaces/identifiable';

@Entity()
export class Playlist implements Identifiable {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  public name: string;

  // Relations

  @ManyToOne(
    type => User,
    user => user.playlists,
    { onDelete: 'CASCADE', eager: true, nullable: false }, //TODO: delete eager
  )
  public user: User;

  @OneToMany(
    type => PlaylistItem,
    playlistItem => playlistItem.playlist,
    { onDelete: 'CASCADE', nullable: false },
  )
  public playlistItems: PlaylistItem[];
}
