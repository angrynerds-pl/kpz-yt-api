import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from 'typeorm';
  import { Playlist } from '../../playlist/entities/playlist.entity';
  
  @Entity()
  export class PlaylistItem {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public ytID: string;

    @Column()
    public title: string;
  
    // Relations
    @ManyToOne(
      type => Playlist,
      playlist => playlist.playlistItems,
      {onDelete: 'CASCADE'}, )
      public playlist: Playlist;
  }
  