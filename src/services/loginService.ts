import { LoginResponse, ResetPasswordResponse } from '../models/models';

class LoginService {
  async resetPassword(username: string): Promise<ResetPasswordResponse> {
    return Promise.resolve({ successful: true });
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    return Promise.resolve({ successful: true, token: 'jwt_token' });
  }
}

export default new LoginService();
