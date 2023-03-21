import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { useEffect } from 'react';

import { DialogActions } from '../../redux/actions';
import { ICurrentUser } from '../../redux/actions/User';
interface IOptions {
  value: ICurrentUser;
  label: string;
}

const onSearch = (value: string) => {
  console.log('search:', value);
};
interface ISelect {
  setSelectedUser: (option: string) => void;
}

const SelectInput: React.FC<ISelect> = ({ setSelectedUser }) => {
  const dispatch = useAppDispatch();
  const user_id = useSelector(
    (state: RootState) => state.UserReducer.currentUser.id
  );
  const users = useSelector(
    (state: RootState) => state.DialogsReducer.DialogUsers
  );
  const formatedData: IOptions[] = users.map((item: ICurrentUser) => {
    return {
      value: JSON.stringify(item),
      label: item.fullname,
    };
  });
  const onChange = (option: string) => {
    console.log(`selected ${option}`);
    setSelectedUser(option);
  };
  useEffect(() => {
    async function fetchUsers() {
      dispatch(DialogActions.setUsersExceptMe(user_id));
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Select
      showSearch
      placeholder="Select a person"
      optionFilterProp="children"
      onChange={onChange}
      onSearch={onSearch}
      filterOption={(input: string, option: any) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={formatedData}
    />
  );
};

export default SelectInput;
