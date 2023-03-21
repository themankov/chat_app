import { IDialogItem } from './../reducers/dialogs';

import axios from 'axios';
import { AuthActions, DialogActions, MessageActions, UserActions } from '.';
import { API_URL } from '../../core/axios';
import socket from '../../core/socket';
import { AuthService, UserService } from '../../services';

import { AppDispatch, store } from '../store';

export interface ICurrentUser {
  email: string;
  id: string;
  fullname: string;
  isactivated: boolean;
}
const Actions = {
  setCurrentUser: (user: ICurrentUser) => ({
    type: 'SET_CURRENT_USER',
    payload: user,
  }),
  setDefaultState: () => {
    return {
      type: 'DEFAULT_STATE',
    };
  },
  updateUserOnline: (data: IDialogItem[], user_id: number, time: string) => {
    // //верни данные, которые содержат данные user
    // const selectedData = data.filter(
    //   (item) =>
    //     item.authorid.user_id === user_id || item.partnerid.user_id === user_id
    // ); //[{dialog_id,textdata,partnerid:{user_id,last_seen},authorid:{user_id,last_seen}, updatedat}]
    for (let i = 0; i < data.length; i++) {
      if (data[i].partnerid.user_id === user_id) {
        data[i].partnerid.last_seen = time;
      } else if (data[i].authorid.user_id === user_id) {
        data[i].authorid.last_seen = time;
      }
    }
    console.log(data);
    // const formatedData: any = [];
    // console.log('selectedData', selectedData);
    // selectedData.forEach((item, index) => {
    //   const findUser =
    //     item.authorid.user_id === user_id
    //       ? (item.authorid.last_seen = time)
    //       : (item.partnerid.last_seen = time);
    //   console.log('finduser', findUser);
    //   formatedData.push({ ...item, findUser });
    // });
    // console.log(formatedData);
    return {
      type: 'UPDATE_USER_ONLINE',
      payload: { data },
    };
  },
  setAsyncLogout: (user_id: number) => {
    return async (dispatch: AppDispatch) => {
      AuthService.logout()
        .then(({ data }) => {
          localStorage.removeItem('token');
          dispatch(AuthActions.setAuthLogout());
          dispatch(DialogActions.setDefaultDialogs());
          dispatch(UserActions.setDefaultState());
          dispatch(MessageActions.setDefaultState());
        })

        .catch((e) => {
          console.log(e);
        });
    };
  },
  setAsyncLogin: (email: string, password: string) => {
    return async (dispatch: AppDispatch) => {
      AuthService.login(email, password)
        .then(({ data }) => {
          console.log(data);
          localStorage.setItem('token', data.accessToken);
          // const formatesData={...data.user, last_seen}
          dispatch(UserActions.setCurrentUser(data.user));

          if (data.user.isactivated) {
            dispatch(AuthActions.setAuthLogin());
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };
  },
  setAsyncCheck: () => {
    return async (dispatch: AppDispatch) => {
      axios
        .get(`${API_URL}api/users/refresh`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          console.log(data);
          localStorage.setItem('token', data.accessToken);
          dispatch(UserActions.setCurrentUser(data.user));
          if (data.user.isactivated) {
            dispatch(AuthActions.setAuthLogin());
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };
  },
};
export default Actions;
