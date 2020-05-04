import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/entities/user.entity';
import { SessionHelper } from './helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const testUser: Partial<User> = {
    username: 'testuser',
    password: 'testpass',
    firstname: 'John',
    lastname: 'Tester',
  };

  let createdUserId: Number;
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
    let invalidUser = { username: 'someusername' }; // Missing other properties

    const res = await request(app.getHttpServer())
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
    console.log('\n\n\n' + authToken + '\n\n\n');

    const res = await request(app.getHttpServer())
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
    let dto = { firstname: 'Krzysztof', lastname: 'Krawczyk' };

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
      .get('/users')
      // .send(createdUserId)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(403);
  });
});
