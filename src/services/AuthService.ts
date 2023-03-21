import { AxiosResponse } from 'axios';

import { axios } from '../core/index';
export interface IUser {
  fullname: string;
  email: string;
  password: string;
  id: string;
  isactivated: boolean;
}
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return axios.post<AuthResponse>('/api/users/login', { email, password });
  }
  static async registration(
    email: string,
    password: string,
    fullname: string
  ): Promise<AxiosResponse<AuthResponse>> {
    const data = await axios.post<AuthResponse>('/api/users/register', {
      email,
      password,
      fullname,
    });

    return data;
  }
  static async logout(): Promise<AxiosResponse> {
    const data = axios.post('/api/users/logout');
    return data;
  }
}
