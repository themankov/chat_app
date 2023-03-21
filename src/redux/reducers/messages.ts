import { IMessage } from './../../components/Message/index';

interface initialStateInterface {
  items: IMessage[];
}
const initialState: initialStateInterface = {
  items: [],
};
const messagesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        items: [...action.payload],
      };
    case 'DEFAULT_STATE':
      return initialState;
    case 'UPDATE_MESSAGES':
      return {
        items: [...state.items, ...action.payload],
      };
    case 'UPDATE_READ_MESSAGE':
      return { items: [...action.payload] };
    case 'DELETE_MESSAGE_FROM_DIALOG':
      return {
        items: [
          ...state.items.filter((item) => item.dialogid !== action.payload),
        ],
      };
    case 'DELETE_MESSAGE':
      return {
        items: state.items.filter((item) => item.message_id !== action.payload),
      };
    default:
      return state;
  }
};
export default messagesReducer;
