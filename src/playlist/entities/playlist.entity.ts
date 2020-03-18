import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PlaylistItem } from '../../playlistitem/entities/playlistitem.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  public id?: number;

  // Relations

  @ManyToOne(
    type => User,
    user => user.playlists,
    {
      nullable: true,
    },
  )
  public user: User;

  @OneToMany(
    type => PlaylistItem,
    playlistItem => playlistItem.playlist,
    {onDelete: 'CASCADE'},
  )
  public playlistItems: PlaylistItem[];
}
