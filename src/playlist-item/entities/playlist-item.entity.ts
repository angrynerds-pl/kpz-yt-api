import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Playlist } from '../../playlist/entities/playlist.entity';

@Entity()
export class PlaylistItem {
  @PrimaryGeneratedColumn()
  public id: number;

  //Relations

  @ManyToOne(
    () => Playlist,
    playlist => playlist.playlistItem,
    { onDelete: 'CASCADE' },
  )
  public playlist: Playlist;
}
