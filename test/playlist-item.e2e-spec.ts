import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Session, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import {
  UserHelper,
  SessionHelper,
  PlaylistHelper,
  PlaylistItemHelper,
} from './helper';
import { Playlist } from '../src/playlist/entities/playlist.entity';
import { User } from '../src/user/entities/user.entity';
import { PlaylistItem } from '../src/playlist-item/entities/playlist-item.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('PlaylistItem', () => {
  let app: INestApplication;

  let createdUserA: Partial<User>;
  let authTokenUserA;
  let createdPlaylistUserA: Partial<Playlist>;
  let createdPlaylistItemUserA: Partial<PlaylistItem>;

  let createdUserB: Partial<User>;
  let authTokenUserB;
  let createdPlaylistUserB: Partial<Playlist>;
  let createdPlaylistItemUserB: Partial<PlaylistItem>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const server = app.getHttpServer();

    // Create User A resources
    const dtoUserA: CreateUserDto = {
      username: 'PlaylistItemTesterA',
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
    createdPlaylistUserA = await PlaylistHelper.createPlaylist(
      server,
      authTokenUserA,
      {
        name: 'playlistUserA',
        user: {
          id: createdUserA.id,
        },
      },
    );
    createdPlaylistItemUserA = await PlaylistItemHelper.createPlaylistItem(
      server,
      authTokenUserA,
      createdPlaylistUserA.id,
      {
        ytID: '9zfXD8wjzfc',
        playlist: {
          id: createdPlaylistUserA,
        },
      },
    );

    // Create User B resources
    const dtoUserB: CreateUserDto = {
      username: 'PlaylistItemTesterB',
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
    createdPlaylistUserB = await PlaylistHelper.createPlaylist(
      server,
      authTokenUserB,
      {
        name: 'playlistUserB',
        user: {
          id: createdUserB.id,
        },
      },
    );
    createdPlaylistItemUserB = await PlaylistItemHelper.createPlaylistItem(
      server,
      authTokenUserB,
      createdPlaylistUserB.id,
      {
        ytID: '9zfXD8wjzfc',
        playlist: {
          id: createdPlaylistUserB,
        },
      },
    );
  });

  // All playlist items GET

  it('/playlist-items (GET) - invalid auth token', async () => {
    await request(app.getHttpServer())
      .get('/playlist-items')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  it('/playlist-items (GET) - valid auth token, forbidden', async () => {
    await request(app.getHttpServer())
      .get('/playlist-items')
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(403);
  });

  // Playlist item GET

  it('/playlist-items/:id (GET) - invalid auth token', async () => {
    await request(app.getHttpServer())
      .get('/playlist-items/' + createdPlaylistItemUserA.id)
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  it("/playlist-items/:id (GET) - other user's playlist item", async () => {
    await request(app.getHttpServer())
      .get('/playlist-items/' + createdPlaylistItemUserB.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(403);
  });

  it('/playlist-items/:id (GET) - get playlist item by id', async () => {
    const res = await request(app.getHttpServer())
      .get('/playlist-items/' + createdPlaylistItemUserA.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(200);

    const playlistItem = res.body.data;
    expect(playlistItem.ytID).toEqual(createdPlaylistItemUserA.ytID);
    expect(playlistItem).toHaveProperty('id');
  });

  // Playlist item PUT

  it('/playlist-items/:id (PUT) - invalid auth token', async () => {
    const dto = { ytID: 'hehehehehe' };

    await request(app.getHttpServer())
      .put('/playlist-items/' + createdPlaylistItemUserA.id)
      .set('Authorization', 'Bearer invalidtoken')
      .send(dto)
      .expect(401);
  });

  it('/playlist-items/:id (PUT)', async () => {
    const dto = { ytID: 'hehehehehe' };

    await request(app.getHttpServer())
      .put('/playlist-items/' + createdPlaylistItemUserB.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .send(dto)
      .expect(403);
  });

  it('/playlist-items/:id (PUT)', async () => {
    const dto = { ytID: 'hehehehehe' };

    const res = await request(app.getHttpServer())
      .put('/playlist-items/' + createdPlaylistItemUserA.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .send(dto)
      .expect(200);

    const updated = res.body.data;
    expect(updated.ytID).toEqual(dto.ytID);
    expect(updated.id).toEqual(createdPlaylistItemUserA.id);
  });

  // Playlist item DELETE

  it('/playlist-items/:id (DELETE) - invalid auth token', async () => {
    await request(app.getHttpServer())
      .delete('/playlist-items/' + createdPlaylistItemUserA.id)
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  it("/playlist-items/:id (DELETE) - other user's playlist item", async () => {
    await request(app.getHttpServer())
      .delete('/playlist-items/' + createdPlaylistItemUserB.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(403);
  });

  it('/playlist-items/:id (DELETE)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/playlist-items/' + createdPlaylistItemUserA.id)
      .set('Authorization', 'Bearer ' + authTokenUserA)
      .expect(200);

    const deletedItem = res.body.data;
    expect(deletedItem.id).toEqual(createdPlaylistItemUserA.id);
  });

  afterAll(async () => {
    const server = app.getHttpServer();

    await UserHelper.deleteUser(server, authTokenUserA, createdUserA.id);
    await UserHelper.deleteUser(server, authTokenUserB, createdUserB.id);

    await app.close();
  });
});
