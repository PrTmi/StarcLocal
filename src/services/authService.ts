const TOKEN_KEY_NAME = 'token';

class AuthService {
  private token: string | undefined;

  setToken = (token: string) => {
    sessionStorage.setItem(TOKEN_KEY_NAME, token);
    this.token = token;
  };

  isAuthenticated = (): boolean => {
    const item = sessionStorage.getItem(TOKEN_KEY_NAME);

    if (item != null) {
      this.token = item;
    }
    return item != null;
  };

  logout() {
    this.token = undefined;
    sessionStorage.removeItem(TOKEN_KEY_NAME);
  }
}

export default new AuthService();
