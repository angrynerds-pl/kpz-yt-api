import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { Identyficable } from '../../common/interfaces/identyficable';

@Entity()
export class PlaylistItem implements Identyficable {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public ytID: string;

  // Relations

  @ManyToOne(
    type => Playlist,
    playlist => playlist.playlistItems,
    { onDelete: 'CASCADE' },
  )
  public playlist: Playlist;
}
