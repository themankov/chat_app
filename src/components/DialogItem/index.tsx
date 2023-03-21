import { format, isToday } from 'date-fns';
import { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { Avatar } from '..';
import socket from '../../core/socket';
import { DialogActions } from '../../redux/actions';
import { IDialogItem } from '../../redux/reducers/dialogs';
import { RootState, useAppDispatch } from '../../redux/store';

import style from './DialogItem.module.scss';
export interface DialogCharType {
  avatar: string;
  fullname: string;
  last_seen: string;
  user_id: number;
}

export const formatData = (date: string): string => {
  const formatDate = new Date(date);
  if (isToday(formatDate)) {
    return format(formatDate, 'HH:mm');
  } else {
    return format(formatDate, 'dd.MM.yyyy');
  }
};

const DialogItem: React.FC<IDialogItem> = ({
  unreadedmessages,
  updatedat,

  dialog_id,
  authorid,
  partnerid,
  textdata,
  userid,
}) => {
  const dialogs = useSelector((state: RootState) => state.DialogsReducer.items);
  const dispatch = useAppDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.UserReducer.currentUser.id
  );
  useEffect(() => {
    const dialogs_id = dialogs.map((item: any) => item.dialog_id);
    console.log(dialogs_id);

    socket.emit('ROOMS', dialogs_id);
  }, []);
  const selectDialog = () => {
    dispatch(DialogActions.setCurrentDialog(dialog_id));
    socket.emit('UPDATE_DIALOG_UNREAD_MESSAGES', {
      dialogid: dialog_id,
    });

    socket.emit('JOIN_ROOM', { room: dialog_id });
  };

  return (
    <>
      <li className={style.chat_item} onClick={() => selectDialog()}>
        <Avatar
          {...(currentUser === authorid.user_id
            ? { ...partnerid }
            : { ...authorid })}
        />
        <div className={style.dialog_content}>
          <div className={style.dialog_info}>
            <h1>
              {currentUser === authorid.user_id
                ? partnerid.fullname
                : authorid.fullname}
            </h1>
            <div className={style.last_message}>{textdata}</div>
          </div>
          <div className={style.dialog_help_info}>
            <div className={style.dialog_time}>{formatData(updatedat)}</div>

            <div
              className={`${style.Messages_count} ${
                unreadedmessages === 0 ? style.opacity : ''
              }`}
            >
              {unreadedmessages > 9 ? '9+' : String(unreadedmessages)}
            </div>
          </div>
        </div>
      </li>
      <div className={style.line}></div>
    </>
  );
};
export default DialogItem;
