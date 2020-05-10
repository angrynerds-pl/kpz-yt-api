import * as request from 'supertest';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { create } from 'domain';

export class UserHelper {
  static testUserDto: CreateUserDto = {
    username: 'testuser',
    password: 'testpass',
    firstname: 'John',
    lastname: 'Tester',
  };

  static async createUser(server, dto: CreateUserDto) {
    const res = await request(server)
      .post('/users')
      .send(dto);

    return res.body.data;
  }

  static async deleteUser(server, authToken, userId: Number) {
    const res = await request(server)
      .delete('/users/' + userId)
      .set('Authorization', 'Bearer ' + authToken);

    return res.body.data;
  }
}

export class SessionHelper {
  static async createSession(server, username, password) {
    const dto = { username: username, password: password };
    const resp = await request(server)
      .post('/sessions')
      .send(dto);
    const bearerToken = resp.body.access_token;
    return bearerToken;
  }
}

export class PlaylistHelper {
  static async createPlaylist(server, authToken, createPlaylistDto) {
    const res = await request(server)
      .post('/playlists')
      .set('Authorization', 'Bearer ' + authToken)
      .send(createPlaylistDto);

    const createdPlaylist = res.body.data;
    return createdPlaylist;
  }

  static async deletePlaylist(server, authToken, playlistId) {
    const res = await request(server)
      .delete('/playlists/' + playlistId)
      .set('Authorization', 'Bearer ' + authToken);

    const deletedPlaylist = res.body.data;
    return deletedPlaylist;
  }
}

export class PlaylistItemHelper {
  static async createPlaylistItem(
    server,
    authToken,
    playlistId,
    createPlaylistItemDto,
  ) {
    const res = await request(server)
      .post('/playlists/' + playlistId + '/playlist-items')
      .set('Authorization', 'Bearer ' + authToken)
      .send(createPlaylistItemDto);

    const createdPlaylistItem = res.body.data;
    return createdPlaylistItem;
  }

  static async deletePlaylistItem(server, authToken, playlistItemId) {
    const res = await request(server)
      .delete('/playlist-items/' + playlistItemId)
      .set('Authorization', 'Bearer ' + authToken);

    const deletedPlaylistItem = res.body.data;
    return deletedPlaylistItem;
  }
}
