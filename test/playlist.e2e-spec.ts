import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Session, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AppService } from '../src/app.service';
import { UserHelper, SessionHelper } from './helper';
import { Playlist } from '../src/playlist/entities/playlist.entity';
import { User } from '../src/user/entities/user.entity';

describe('Playlist', () => {
  let app: INestApplication;

  let authToken;
  let createdUser: Partial<User>;
  let createdPlaylist: Partial<Playlist>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const server = await app.getHttpServer();

    // Create test user and session
    createdUser = await UserHelper.createTestUser(
      server,
      UserHelper.testUserDto,
    );
    authToken = await SessionHelper.createSession(
      server,
      UserHelper.testUserDto.username,
      UserHelper.testUserDto.password,
    );

    // Create playlist for testing
  });

  it(`/playlists (POST)`, async () => {
    const playlistDto = {
      name: 'playlistName',
      user: {
        id: createdUser.id,
      },
    };

    const res = await request(app.getHttpServer())
      .post('/playlists')
      .set('Authorization', 'Bearer ' + authToken)
      .send(playlistDto);

    createdPlaylist = res.body.data;

    expect(createdPlaylist.name).toEqual(playlistDto.name);
    expect(createdPlaylist.user.id).toEqual(playlistDto.user.id);
  });

  it(`/playlists (GET)`, async () => {
    const res = await request(app.getHttpServer())
      .get('/playlists')
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200);

    const playlists = res.body.data;

    expect(Array.isArray(playlists)).toBe(true);
    let containsCreatedPlaylist = false;
    playlists.forEach(element => {
      expect(element).toHaveProperty('id');
      expect(element.name).toEqual(createdPlaylist.name);
      expect(element).toHaveProperty('user');
      expect(element.user.id).toEqual(createdUser.id);
      if (element.id === createdPlaylist.id) {
        containsCreatedPlaylist = true;
      }
    });
    expect(containsCreatedPlaylist).toBe(true);
  });

  // it(`/playlists/:id (GET) - invalid authorization token`, async () => {
  //   const playlistToGet = createdPlaylist;

  //   await request(app.getHttpServer())
  //     .get('/playlists/' + playlistToGet.id)
  //     .set('Authorization', 'Bearer invalidtoken')
  //     .expect(403);
  // });

  it(`/playlists/:id (GET) - get by id`, async () => {
    const playlistToGet = createdPlaylist;
    const res = await request(app.getHttpServer())
      .get('/playlists/' + playlistToGet.id)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200);

    const responsePlaylist = res.body.data;

    expect(responsePlaylist.id).toEqual(playlistToGet.id);
    expect(responsePlaylist.name).toEqual(playlistToGet.name);
    expect(responsePlaylist.user.id).toEqual(createdUser.id);
  });

  it(`/playlists/:id (PUT)`, async () => {
    const updateDto = { name: 'updatedPlaylistName' };

    const res = await request(app.getHttpServer())
      .put('/playlists/' + createdPlaylist.id)
      .set('Authorization', 'Bearer ' + authToken)
      .send(updateDto)
      .expect(200);

    const updatedPlaylist = res.body.data;
    expect(updatedPlaylist.id).toEqual(createdPlaylist.id);
    expect(updatedPlaylist.name).toEqual(updateDto.name);
    expect(updatedPlaylist.user.id).toEqual(createdPlaylist.user.id);
  });

  it(`/playlists/:id/playlist-items (POST)`, async () => {
    const res = await request(app.getHttpServer())
      .post('/GETplaylists/' + createdPlaylist.id + '/playlist-items')
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200);

    const updatedPlaylist = res.body.data;
  });

  it(`/playlists/:id/playlist-items (GET)`, async () => {
    const res = await request(app.getHttpServer())
      .get('/playlists/' + createdPlaylist.id + '/playlist-items')
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200);

    const updatedPlaylist = res.body.data;
  });

  it(`/playlists/:id (DELETE)`, async () => {
    const res = await request(app.getHttpServer())
      .delete('/playlists/' + createdPlaylist.id)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200);

    const playlist = res.body.data;
    expect(playlist.id).toEqual(createdPlaylist.id);
  });

  afterAll(async () => {
    await UserHelper.deleteTestUser(
      app.getHttpServer(),
      authToken,
      createdUser.id,
    );
    await app.close();
  });
});
