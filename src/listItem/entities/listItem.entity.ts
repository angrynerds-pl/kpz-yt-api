import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm'
import { Playlist } from '../../playlist/entities/playlist.entity';

@Entity()
export class ListItem {
    @PrimaryGeneratedColumn()
    public id?:number;

    //Relations

    @ManyToOne(
        type => Playlist,
        playlist => playlist.listItem,
        { onDelete: 'CASCADE'}
    )
    public playlist: Playlist;
}