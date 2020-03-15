import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
  } from 'typeorm';
  import { User } from '../../user/entities/user.entity';
  import { ListItem } from '../../listItem/entities/listItem.entity';
  
  @Entity()
  export class Playlist {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column()
    public name?: string;
  
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
        type => ListItem,
        listItem => listItem.playlist,
        {
            nullable: true,
        },
    )
    public listItem: ListItem;
  }