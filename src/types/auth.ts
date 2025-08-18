export interface User {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
