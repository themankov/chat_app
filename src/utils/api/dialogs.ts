import { axios } from './../../core';
const DialogsApi = {
  getAllDialogsById: async (user_id: number) => {
    const data = await axios.post('/api/dialogs/getDialogById', { user_id });
    return data;
  },
  getUsersExceptMe: async (user_id: number) => {
    const data = await axios.post('/api/users/getUsersExceptMe', { user_id });
    return data;
  },
};

export default DialogsApi;
