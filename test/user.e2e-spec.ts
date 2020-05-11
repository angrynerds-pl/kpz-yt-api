import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/entities/user.entity';
import { SessionHelper, PlaylistItemHelper, PlaylistHelper } from './helper';

describe('User (e2e)', () => {
  let app: INestApplication;

  const testUser: Partial<User> = {
    username: 'UserTester',
    password: 'password',
    firstname: 'John',
    lastname: 'Tester',
  };

  let createdUserId: number;
  let authToken;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET) - invalid token', () => {
    request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  it('/users (POST) - create user, invalid DTO', async () => {
    const invalidUser = { username: 'someusername' }; // Missing other properties

    await request(app.getHttpServer())
      .post('/users')
      .send(invalidUser)
      .expect(400);
  });

  it('/users (POST) - create user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send(testUser)
      .expect(201);

    expect(res.body.data).not.toHaveProperty('password');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.username).toEqual(testUser.username);
    expect(res.body.data.firstname).toEqual(testUser.firstname);
    expect(res.body.data.lastname).toEqual(testUser.lastname);

    createdUserId = res.body.data.id;

    // Create session for created user
    authToken = await SessionHelper.createSession(
      app.getHttpServer(),
      testUser.username,
      testUser.password,
    );
  });

  it('/users (POST) - create duplicate user', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(testUser)
      .expect(409);
  });

  it('/users (GET) - get all users', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer ' + authToken)
      .expect(403);
  });

  it('/users/:id (GET) - get created user by id', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/' + createdUserId)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200);

    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.username).toEqual(testUser.username);
    expect(res.body.data.firstname).toEqual(testUser.firstname);
    expect(res.body.data.lastname).toEqual(testUser.lastname);
  });

  it('/users/:id (PUT) - update created user', async () => {
    const dto = { firstname: 'Krzysztof', lastname: 'Krawczyk' };

    const res = await request(app.getHttpServer())
      .put('/users/' + createdUserId)
      .set('Authorization', 'Bearer ' + authToken)
      .send(dto)
      .expect(200);

    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.username).toEqual(testUser.username);
    expect(res.body.data.firstname).toEqual(dto.firstname);
    expect(res.body.data.lastname).toEqual(dto.lastname);
  });

  it('/users/:id/top-titles/:limit (GET) - Get top titles with amount limit', async () => {
    const server = app.getHttpServer();

    const bigPlaylist = await PlaylistHelper.createPlaylist(server, authToken, {
      name: 'bigPlaylist',
      user: {
        id: createdUserId,
      },
    });
    await PlaylistItemHelper.createPlaylistItem(
      server,
      authToken,
      bigPlaylist.id,
      { ytID: 'H-zFRGP7MUQ', playlist: { id: bigPlaylist.id } },
    );
    await PlaylistItemHelper.createPlaylistItem(
      server,
      authToken,
      bigPlaylist.id,
      { ytID: 'qNj_sI6qndw', playlist: { id: bigPlaylist.id } },
    );

    const smallPlaylist = await PlaylistHelper.createPlaylist(
      server,
      authToken,
      {
        name: 'smallPlaylist',
        user: {
          id: createdUserId,
        },
      },
    );
    const itemMostPlaybacks = await PlaylistItemHelper.createPlaylistItem(
      server,
      authToken,
      smallPlaylist.id,
      { ytID: '_gGSFcrBdXA', playlist: { id: smallPlaylist.id } },
    );
    // Update playbackCount to a high number
    await PlaylistItemHelper.updatePlaylistItem(
      server,
      authToken,
      itemMostPlaybacks.id,
      { playbackCount: 10000 },
    );

    // Get 2 titles with the highest playback count
    const amountLimit = 2;
    const res = await request(app.getHttpServer())
      .get('/users/' + createdUserId + '/top-titles/' + amountLimit)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200);
    const topTitles = res.body.data;

    console.log(JSON.stringify(topTitles));

    expect(Array.isArray(topTitles)).toBe(true);
    expect(topTitles.length).toBeLessThanOrEqual(amountLimit);
    expect(
      topTitles[topTitles.length - 1].playbackCount,
    ).toBeGreaterThanOrEqual(topTitles[0].playbackCount);
  });

  it('/users/:id/top-titles/:limit (GET) - Other user\'s top titles', async () => {
    await request(app.getHttpServer())
      .get('/users/' + (createdUserId+1).toString() + '/top-titles/' + '1')
      .set('Authorization', 'Bearer ' + authToken)
      .expect(403);
  });

  it('/users/:id/top-titles/:limit (GET) - Invalid auth token', async () => {
    await request(app.getHttpServer())
      .get('/users/' + createdUserId + '/top-titles/' + 1)
      .set('Authorization', 'Bearer ' + 'invalidToken')
      .expect(401);
  });

  it('/users/:id (DELETE) - delete user', async () => {
    await request(app.getHttpServer())
      .delete('/users/' + createdUserId)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200);
  });

  it('/users/:id (DELETE) - delete user, invalid id', async () => {
    await request(app.getHttpServer())
      .delete('/users/' + createdUserId)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(404);
  });

  it('/users/:id (GET) - get user, invalid id', async () => {
    await request(app.getHttpServer())
      .get('/users/' + (createdUserId+1).toString())
      .set('Authorization', 'Bearer ' + authToken)
      .expect(403);
  });
});
