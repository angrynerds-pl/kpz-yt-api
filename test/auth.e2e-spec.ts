import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import {
  UserHelper,
  SessionHelper,
} from './helper';
import { User } from '../src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as jwtDecode from 'jwt-decode';

describe('Session', () => {
  let app: INestApplication;

  let createdUser: Partial<User>;
  const userCreateDto: CreateUserDto = {
    username: 'AuthTester',
    password: 'password',
    firstname: 'John',
    lastname: 'Tester',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(async () => {
    createdUser = await UserHelper.createUser(
      app.getHttpServer(),
      userCreateDto,
    );
  });

  afterEach(async () => {
    const server = app.getHttpServer();

    const authToken = await SessionHelper.createSession(
      server,
      userCreateDto.username,
      userCreateDto.password,
    );
    await UserHelper.deleteUser(server, authToken, createdUser.id);
  });

  it('/session (POST) - valid password', async () => {
    const dto = {
      username: userCreateDto.username,
      password: userCreateDto.password,
    };

    const res = await request(app.getHttpServer())
      .post('/sessions')
      .send(dto)
      .expect(201);

    const token = res.body.access_token;
    const decodedToken = jwtDecode(token);
    expect(decodedToken['user']['username']).toEqual(userCreateDto.username);
  });

  it('/session (POST) - invalid password', async () => {
    const dto = {
      username: userCreateDto.username,
      password: 'invalidpasswords',
    };

    const res = await request(app.getHttpServer())
      .post('/sessions')
      .send(dto)
      .expect(404);

    const token = res.body.access_token;

    let exceptionName = '';
    try {
      jwtDecode(token);
    } catch (error) {
      exceptionName = error.name;
    }

    expect(exceptionName).toEqual('InvalidTokenError');
  });

  afterAll(async () => {
    await app.close();
  });
});
