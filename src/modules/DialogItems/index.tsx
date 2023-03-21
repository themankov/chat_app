import style from './DialogItems.module.scss';
import { Empty, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { orderBy } from 'lodash';
import { DialogItem, ModalPage } from '../../components';
import { useEffect, useRef, useState } from 'react';

import { DialogActions, UserActions } from '../../redux/actions';
import { store, useAppDispatch, useAppSelector } from '../../redux/store';
import socket from '../../core/socket';
import { IDialogItem } from '../../redux/reducers/dialogs';

export type PartnerType = {
  fullname: string;
  isOnline: Boolean;
  img?: string;
  userId: String;
};
export interface ItemInterface {
  Id: string;
  lastMessage: String;
  unreadMessages: Number;
  createdAt: Date;
  partner: PartnerType;
}

const DialogItems: React.FC = () => {
  const dispatch = useAppDispatch();
  const dialogs = useAppSelector((state) => state.DialogsReducer.items);
  const isMounted = useRef(false);

  const [validate, setvalidate] = useState(Array.from(dialogs));

  useEffect(() => {
    dispatch(DialogActions.setAsyncDialogs());
    isMounted.current = true;
    socket.on('GET_USER_ONLINE', (data) => {
      dispatch(
        UserActions.updateUserOnline(
          store.getState().DialogsReducer.items,
          data.id,
          'Online'
        )
      );
    });

    socket.emit('USER_ONLINE', store.getState().UserReducer.currentUser.id);
    socket.on('GET_DIALOG_LAST_MESSAGE', (data) => {
      dispatch(DialogActions.updateDialogData(data, data.dialog_id));
    });
    socket.on('GET_UNREADED_MESSAGES', (data) => {
      const { count, dialogid } = data;
      const dialogs = store.getState().DialogsReducer.items;
      dispatch(
        DialogActions.updateDialogUnreadMessages({ dialogid, dialogs, count })
      );
    });
   
      socket.on('GET_CREATED_DIALOG', (data) => {
        dispatch(DialogActions.setDialogs([data]));
      });
   

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (isMounted) {
      setvalidate(dialogs);
    }
  }, [dialogs]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let validatedItems = Array.from(dialogs).filter(
      (item: any) =>
        item.partnerid.fullname
          .toLowerCase()
          .indexOf(e.target.value.trim().toLowerCase()) > -1
    );

    setvalidate(validatedItems);
  };

  return (
    <div className={style.chats}>
      <div className={style.chats__wrapper}>
        <Input
          placeholder="Search your friend name"
          prefix={<SearchOutlined />}
          onChange={onChange}
        />
        <div className={style.chats_block}>
          <h1>Chats</h1>
          <ul className={style.chat_items}>
            {validate.length ? (
              orderBy(validate, ['updatedat'], ['desc']).map((item: any) => {
                return <DialogItem key={item.dialog_id} {...item} />;
              })
            ) : (
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 60 }}
                description={<span>No data</span>}
              />
            )}
          </ul>
        </div>
        <div className={style.chats_button}>
          <ModalPage />
        </div>
      </div>
    </div>
  );
};
export default DialogItems;
