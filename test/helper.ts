import { User } from '../src/user/entities/user.entity';
import * as request from 'supertest';

export class UserHelper {
  static testUser: Partial<User> = {
    username: 'testuser',
    password: 'testpass',
    firstname: 'John',
    lastname: 'Tester',
  };

  static async createTestUser(server) {
    const res = await request(server)
      .post('/users')
      .send(UserHelper.testUser);

    return res.body.data;
  }

  static async deleteTestUser(server, userId: Number) {
    const res = await request(server).delete('/users/' + userId);

    return res.body.data;
  }
}

export class SessionHelper {
  static async createSession(server, username, password) {
    let dto = { username: username, password: password };
    let resp = await request(server)
      .post('/sessions')
      .send(dto);
    let bearerToken = resp.body.access_token;
    return bearerToken;
  }
}
