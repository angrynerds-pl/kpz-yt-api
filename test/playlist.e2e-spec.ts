import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Session, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UserHelper, SessionHelper } from './helper';
import { Playlist } from '../src/playlist/entities/playlist.entity';
import { User } from '../src/user/entities/user.entity';
import { CreateUserDto } from '../src/user/dto/create-user.dto';

describe('Playlist', () => {
  let app: INestApplication;

  let createdUserA: Partial<User>;
  let authTokenUserA;
  let createdPlaylistForUserA: Partial<Playlist>;

  let createdUserB: Partial<User>;
  let authTokenUserB;
  let createdPlaylistForUserB: Partial<Playlist>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const server = await app.getHttpServer();

    // Create User A resources
    const dtoUserA = {
      username: 'PlaylistTesterA',
      password: 'password',
      firstname: 'John',
      lastname: 'Tester',
    };

    createdUserA = await UserHelper.createUser(server, dtoUserA);
    authTokenUserA = await SessionHelper.createSession(
      server,
      dtoUserA.username,
      dtoUserA.password,
    );

    // Create User B resources
    const dtoUserB: CreateUserDto = {
      username: 'PlaylistTesterB',
      password: 'password',
      firstname: 'John',
      lastname: 'Tester',
    };
    createdUserB = await UserHelper.createUser(server, dtoUserB);

    authTokenUserB = await SessionHelper.createSession(
      server,
      dtoUserB.username,
      dtoUserB.password,
    );

    const playlistDtoUserB = {
      name: 'playlistForUserB',
      user: {
        id: createdUserB.id,
      },
    };

    createdPlaylistForUserB = (
      await request(server)
        .post('/playlists')
        .set('Authorization', 'Bearer ' + authTokenUserB)
        .send(playlistDtoUserB)
    ).body.data;
  });

  // Playlist POST

  it(`/playlists (POST) - create, invalid token`, async () => {
    const playlistDto = {
      name: 'playlistName',
      user: {
        id: createdUserA.id,
      },
    };

    const res = await request(app.getHttpServer())
      .post('/playlists')
      .set('Authorization', 'Bearer invalidtoken')
      .send(playlistDto)
      .expect(401);
  });

  it(`/playlists (POST) - create playlist for testing`, async () => {
    const playlistDto = {
      name: 'playlistName',
      user: {
        id: createdUserA.id,
      },
    };

    const res = await request(app.getHttpServer())
      .post('/playlists')
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .send(playlistDto)
      .expect(201);

    createdPlaylistForUserA = res.body.data;

    expect(createdPlaylistForUserA.name).toEqual(playlistDto.name);
    expect(createdPlaylistForUserA.user.id).toEqual(playlistDto.user.id);
  });

  // Playlist GET

  it(`/playlists (GET) - get all playlists (forbidden)`, async () => {
    const res = await request(app.getHttpServer())
      .get('/playlists')
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(403);
  });

  it(`/playlists/:id (GET) - get by id, invalid auth token`, async () => {
    await request(app.getHttpServer())
      .get('/playlists/' + createdPlaylistForUserA.id)
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  it(`/playlists/:id (GET) - get by id, other user's playlist, forbidden`, async () => {
    await request(app.getHttpServer())
      .get('/playlists/' + createdPlaylistForUserB.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(403);
  });

  it(`/playlists/:id (GET) - get by id, valid auth token`, async () => {
    const playlistToGet = createdPlaylistForUserA;
    const res = await request(app.getHttpServer())
      .get('/playlists/' + playlistToGet.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(200);

    const responsePlaylist = res.body.data;

    expect(responsePlaylist.id).toEqual(playlistToGet.id);
    expect(responsePlaylist.name).toEqual(playlistToGet.name);
    expect(responsePlaylist.user.id).toEqual(createdUserA.id);
  });

  // Playlist PUT

  it(`/playlists/:id (PUT) - update, valid auth token`, async () => {
    const updateDto = { name: 'updatedPlaylistName' };

    const res = await request(app.getHttpServer())
      .put('/playlists/' + createdPlaylistForUserA.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .send(updateDto)
      .expect(200);

    const updatedPlaylist = res.body.data;
    expect(updatedPlaylist.id).toEqual(createdPlaylistForUserA.id);
    expect(updatedPlaylist.name).toEqual(updateDto.name);
    expect(updatedPlaylist.user.id).toEqual(createdPlaylistForUserA.user.id);
  });

  it(`/playlists/:id (PUT) - update, invalid auth token`, async () => {
    const updateDto = { name: 'updatedPlaylistName' };

    const res = await request(app.getHttpServer())
      .put('/playlists/' + createdPlaylistForUserA.id)
      .set('Authorization', 'Bearer invalidtoken')
      .send(updateDto)
      .expect(401);
  });

  it(`/playlists/:id (DELETE), invalid auth token`, async () => {
    const res = await request(app.getHttpServer())
      .delete('/playlists/' + createdPlaylistForUserA.id)
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  // Playlist items POST

  it(`/playlists/:id/playlist-items (POST), add item, invalid auth token`, async () => {
    const playlistItemDto = {
      ytID: '9zfXD8wjzfc',
      playlist: {
        id: 1,
      },
    };

    const res = await request(app.getHttpServer())
      .post('/playlists/' + createdPlaylistForUserA.id + '/playlist-items')
      .set('Authorization', 'Bearer invalidtoken')
      .send(playlistItemDto)
      .expect(401);
  });

  it(`/playlists/:id/playlist-items (POST), add item, other user's playlist, forbidden`, async () => {
    const playlistItemDto = {
      ytID: '9zfXD8wjzfc',
      playlist: {
        id: 1,
      },
    };

    const res = await request(app.getHttpServer())
      .post('/playlists/' + createdPlaylistForUserB.id + '/playlist-items')
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .send(playlistItemDto)
      .expect(403);
  });

  it(`/playlists/:id/playlist-items (POST), add item`, async () => {
    const playlistItemDto = {
      ytID: '9zfXD8wjzfc',
      playlist: {
        id: createdPlaylistForUserA.id,
      },
    };

    const res = await request(app.getHttpServer())
      .post('/playlists/' + createdPlaylistForUserA.id + '/playlist-items')
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .send(playlistItemDto)
      .expect(201);

    const addedPlaylist = res.body.data;
    expect(addedPlaylist.ytID).toEqual(playlistItemDto.ytID);
    expect(addedPlaylist.playlist.id).toEqual(
      playlistItemDto.playlist.id.toString(),
    );
    expect(addedPlaylist).toHaveProperty('id');
  });

  // Playlist items GET

  it(`/playlists/:id/playlist-items (GET), get items, invalid auth token`, async () => {
    const res = await request(app.getHttpServer())
      .get('/playlists/' + createdPlaylistForUserA.id + '/playlist-items')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  it(`/playlists/:id/playlist-items (GET), get items, other user's playlist, forbidden`, async () => {
    const res = await request(app.getHttpServer())
      .get('/playlists/' + createdPlaylistForUserB.id + '/playlist-items')
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(403);
  });

  it(`/playlists/:id/playlist-items (GET), get items`, async () => {
    const res = await request(app.getHttpServer())
      .get('/playlists/' + createdPlaylistForUserA.id + '/playlist-items')
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(200);

    const playlists = res.body.data;
    expect(Array.isArray(playlists)).toBe(true);
    playlists.forEach(element => {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('ytID');
    });
  });

  // Playlist DELETE

  it(`/playlists/:id (DELETE), other user's playlist, forbidden`, async () => {
    const res = await request(app.getHttpServer())
      .delete('/playlists/' + createdPlaylistForUserB.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(403);
  });

  it(`/playlists/:id (DELETE), valid auth token`, async () => {
    const res = await request(app.getHttpServer())
      .delete('/playlists/' + createdPlaylistForUserA.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(200);

    const playlist = res.body.data;
    expect(playlist.id).toEqual(createdPlaylistForUserA.id);
  });

  afterAll(async () => {
    const server = app.getHttpServer();

    await UserHelper.deleteUser(server, authTokenUserA, createdUserA.id);
    await UserHelper.deleteUser(server, authTokenUserB, createdUserB.id);
    await app.close();
  });
});
