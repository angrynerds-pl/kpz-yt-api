import * as request from 'supertest';
import { CreateUserDto } from '../src/user/dto/create-user.dto';

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
    let dto = { username: username, password: password };
    let resp = await request(server)
      .post('/sessions')
      .send(dto);
    let bearerToken = resp.body.access_token;
    return bearerToken;
  }
}
