import { IDialogItem } from './../reducers/dialogs';
import { DialogsApi } from '../../utils/api';

import { AppDispatch, store } from '../store';
import { ICurrentUser } from './User';

const Actions = {
  setCurrentDialog: (id: number) => ({
    type: 'SET_CURRENT_DIALOG',
    payload: id,
  }),
  deleteDialog: (dialog_id: number) => {
    return {
      type: 'DELETE_DIALOG',
      payload: dialog_id,
    };
  },
  updateDialogUnreadMessages: (item: any) => {
    const { dialogid, dialogs, count } = item;
    debugger;
    for (let i = 0; i < dialogs.length; i++) {
      if (dialogs[i].dialog_id === dialogid) {
        dialogs[i].unreadedmessages = count;
      }
    }
    return {
      type: 'UPDATE_DIALOG_UNREAD',
      payload: { data: dialogs },
    };
  },
  setDefaultDialogs: () => {
    return {
      type: 'DEFAULT_STATE',
    };
  },
  setDialogs: (items: IDialogItem[]) => ({
    type: 'DIALOGS.SET_ITEM',
    payload: items,
  }),
  setDialogUsersExceptMe: (users: ICurrentUser[]) => ({
    type: 'SET_DIALOG_USERS',
    payload: users,
  }),
  // updateUserOnline: (id: number, last_seen: string) => {
  //   console.log(id);
  //   console.log(store.getState().DialogsReducer.items);
  //   const selectedUserInfo = store
  //     .getState()
  //     .DialogsReducer.items.find(
  //       (item) => item.partnerid.user_id === id || item.authorid.user_id === id
  //     );
  //   const { partnerid, authorid, dialog_id } = selectedUserInfo;
  //   let newData = {
  //     ...selectedUserInfo,
  //   };
  //   if (partnerid.user_id === id) {
  //     newData = {
  //       ...selectedUserInfo,
  //       partnerid: {
  //         ...selectedUserInfo.partnerid,
  //         last_seen: last_seen,
  //       },
  //     };
  //   } else if (authorid.user_id === id) {
  //     newData = {
  //       ...selectedUserInfo,
  //       authorid: {
  //         ...selectedUserInfo.authorid,
  //         last_seen: last_seen,
  //       },
  //     };
  //   }

  //   return {
  //     type: 'UPDATE_USER_ONLINE',
  //     payload: { dialog_id, newData },
  //   };
  // },
  updateDialogData: (data: IDialogItem, dialog_id: number) => {
    const selectedDialog = store
      .getState()
      .DialogsReducer.items.find((item) => item.dialog_id === data.dialog_id);

    const newData = {
      ...selectedDialog,
      textdata: data.textdata,
      updatedat: data.updatedat,
    };

    return {
      type: 'UPDATE_DIALOG_LAST_MESSAGE',
      payload: {
        dialog_id,
        newData,
      },
    };
  },
  setUsersExceptMe: (user_id: number) => {
    return async (dispatch: AppDispatch) => {
      DialogsApi.getUsersExceptMe(user_id).then(({ data }) =>
        dispatch(Actions.setDialogUsersExceptMe(data))
      );
    };
  },
  setAsyncDialogs: () => {
    return async (dispatch: AppDispatch) => {
      DialogsApi.getAllDialogsById(store.getState().UserReducer.currentUser.id)

        .then(({ data }) => {
          dispatch(Actions.setDialogs(data));
        })
        .catch((e) => {
          console.log(e);
        });
    };
  },
};
export default Actions;
