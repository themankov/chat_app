import { ICurrentUser } from '../actions/User';

interface initialStateInterface {
  currentUser: ICurrentUser | undefined;
}
const initialState: initialStateInterface = {
  currentUser: undefined,
};
const UserReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'DEFAULT_STATE':
      return initialState;
    case 'SET_CURRENT_USER':
      return {
        currentUser: action.payload,
      };

    default:
      return state;
  }
};
export default UserReducer;
