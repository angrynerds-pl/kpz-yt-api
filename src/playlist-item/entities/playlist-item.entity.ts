import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { Identifiable } from '../../common/interfaces/identifiable';

@Entity()
export class PlaylistItem implements Identifiable {
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
