import { combineReducers } from 'redux';
import messagesReducer from './messages';
import DialogsReducer from './dialogs';
import authReducer from './authReducer';
import UserReducer from './UsersReducer';
export const rootReducer = combineReducers({
  messagesReducer,
  DialogsReducer,
  authReducer,
  UserReducer,
});
