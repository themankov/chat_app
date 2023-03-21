interface initialStateInterface {
  isAuth: boolean;
}

const initialState: initialStateInterface = {
  isAuth: false,
};
const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_LOGIN':
      return {
        isAuth: true,
      };
    case 'SET_LOGOUT':
      return {
        isAuth: false,
      };
    default:
      return state;
  }
};
export default authReducer;
