import axios from 'axios';

import { API_URL } from '../core/axios';
import { DialogActions, UserActions } from '../redux/actions';
import { store } from '../redux/store';
import { AuthService } from './../services';

const AuthHttp = {
  login: async (email: string, password: string) => {
    store.dispatch(UserActions.setAsyncLogin(email, password));
  },

  // asyncLogout: async (email: string, password: string) => {
  //   try {
  //     await AuthService.logout();
  //     localStorage.removeItems('token');
  //   } catch (e) {
  //     console.log(e);
  //   }
  // },
  checkAuth: async () => {
    store.dispatch(UserActions.setAsyncCheck());
  },
  register: async (email: string, password: string, fullname: string) => {
    try {
      console.log('a');
      await AuthService.registration(email, password, fullname);
      // console.log('b');
      // localStorage.setItem('token', response.data.accessToken);

      // store.dispatch(UserActions.setCurrentUser(response.data.user));
    } catch (e) {
      console.log('aaaaaa');
      console.log(e);
    }
  },
};

export default AuthHttp;
