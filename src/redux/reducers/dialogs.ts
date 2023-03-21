import { ICharacter } from '../../services/DialogService';

export interface IDialogItem {
  dialog_id: number;
  textdata: string;
  userid: number;
  partnerid: ICharacter;
  authorid: ICharacter;
  updatedat: string;
  unreadedmessages: number;
}
interface initialStateInterface {
  items: IDialogItem[];
  currentDialog: null | number;
  DialogUsers: any[];
}
const initialState: initialStateInterface = {
  items: [],
  currentDialog: null,
  DialogUsers: [],
};
const DialogsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'DEFAULT_STATE':
      return initialState;
    case 'DIALOGS.SET_ITEM':
      return {
        ...state,
        items: [...state.items, ...action.payload],
      };
    case 'UPDATE_DIALOG_UNREAD':
      return {
        ...state,
        items: [...action.payload.data],
      };
    case 'UPDATE_USER_ONLINE':
      return {
        ...state,
        items: [...action.payload.data],
      };
    case 'DELETE_DIALOG':
      return {
        ...state,
        items: [
          ...state.items.filter((item) => item.dialog_id !== action.payload),
        ],
      };
    // case 'UPDATE_READ_MESSAGE':
    //   return{
    //     ...state,
    //     items
    //   }
    case 'SET_CURRENT_DIALOG':
      return {
        ...state,
        currentDialog: action.payload,
      };
    case 'SET_DIALOG_USERS':
      return {
        ...state,
        DialogUsers: action.payload,
      };
    // case 'UPDATE_USER_ONLINE':
    //   return {
    //     ...state,
    //     items: [
    //       ...state.items.filter(
    //         (item) => item.dialog_id !== action.payload.dialog_id
    //       ),
    //       action.payload.newData,
    //     ],
    //   };
    case 'UPDATE_DIALOG_LAST_MESSAGE':
      return {
        ...state,
        items: [
          ...state.items.filter(
            (item) => item.dialog_id !== action.payload.dialog_id
          ),
          action.payload.newData,
        ],
      };
    default:
      return state;
  }
};
export default DialogsReducer;
