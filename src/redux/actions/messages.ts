import { MessageApi } from '../../utils/api';
import { AppDispatch } from '../store';
import { IMessage } from './../../components/Message/index';
const Actions = {
  setMessages: (items: IMessage[]) => ({
    type: 'SET_MESSAGES',
    payload: items,
  }),
  setDefaultState: () => {
    return {
      type: 'DEFAULT_STATE',
    };
  },
  updateMessages: (items: IMessage[]) => ({
    type: 'UPDATE_MESSAGES',
    payload: items,
  }),
  updateReadMessage: (items: IMessage[], data: IMessage[]) => {
    const formatedData = data.map((item) => item.message_id);
    if (formatedData.length === 0) return;
    for (let j = 0; j < formatedData.length; j++) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].message_id !== formatedData[j]) continue;
        items[i].isread = true;
      }
    }
    return {
      type: 'UPDATE_READ_MESSAGE',
      payload: items,
    };
  },
  deleteMessage: (items: IMessage[]) => ({
    type: 'DELETE_MESSAGE',
    payload: items,
  }),
  deleteMessageFromDialog: (items: IMessage[]) => ({
    type: 'DELETE_MESSAGE_FROM_DIALOG',
    payload: items,
  }),
  asyncsetMessages: (dialog_id: number) => {
    return async (dispatch: AppDispatch) => {
      MessageApi.getAllMessagesById(dialog_id)
        .then(({ data }) => {
          // let reader = new FileReader();
          // for (let i = 0; i < data.length; i++) {
          //   debugger;
          //   if (!data[i].audio) continue;
          //   console.log(data[i].audio, typeof data[i].audio);

          //   reader.readAsDataURL(data[i].audio);
          //   reader.onload = function () {
          //     data[i].audio = reader.result;
          //   };
          // }
          dispatch(Actions.setMessages(data));
        })
        .catch((e) => {
          console.log(e);
        });
    };
  },
  addMessage: (
    userid: number,
    dialogid: number,
    textdata: string,
    sendedat: string
  ) => {
    return async (dispatch: AppDispatch) => {
      MessageApi.createMessage(textdata, dialogid, userid, sendedat)
        .then(({ data }) => {
          dispatch(Actions.updateMessages(data));
        })
        .catch((e) => {
          console.log(e);
        });
    };
  },
};
export default Actions;
