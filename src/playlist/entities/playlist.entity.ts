import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PlaylistItem } from '../../playlistItem/entities/playlistItem.entity';

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
    {
      nullable: true,
    },
  )
  public user: User;

  @OneToMany(
    type => PlaylistItem,
    playlistItem => playlistItem.playlist,
    {
      nullable: true,
    },
  )
  public playlistItem: PlaylistItem;
}
