import { axios } from './../../core/index';
const MessageApi = {
  getAllMessagesById: async (dialog_id: number) => {
    const data = await axios.post('api/message/getMessagesByDialogId', {
      dialog_id,
    });

    return data;
  },
  createMessage: async (
    textdata: string,
    dialogid: number,
    userid: number,
    sendedat: string
  ) => {
    const data = await axios.post('api/message/getMessagesByDialogId', {
      textdata,
      userid,
      dialogid,
      sendedat,
    });
    return data;
  },
};

export default MessageApi;
