import { AxiosResponse } from 'axios';
import { axios } from '../core';
import { IUser } from './AuthService';

export default class UserService {
  static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return axios.get('/users');
  }
}
