import { AxiosResponse } from 'axios';
import { axios } from '../core';
export interface ICharacter {
  user_id: number;
  fullname: string;
  avatar: string;
  last_seen: string;
}
export interface DialogResponse {
  dialog_id: number;
  textData: string;
  partnerid: ICharacter;
  authorid: ICharacter;
  userId: number;
  updateat: string;
}
export default class DialogService {
  static fetchDialogs(
    user_id: number
  ): Promise<AxiosResponse<DialogResponse[]>> {
    const data = axios.post('/api/dialogs/getDialogById', { user_id });
    return data;
  }
}
