import { Avatar, Message } from '../../components';
import { Button, Empty, Popover, Spin, Upload, UploadProps } from 'antd';
import style from './MessagePlace.module.scss';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import {
  StarOutlined,
  SearchOutlined,
  AudioOutlined,
  SmileOutlined,
  UploadOutlined,
  SendOutlined,
  MoreOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Input } from 'antd';
import { useSelector } from 'react-redux';
import { RootState, store, useAppDispatch } from '../../redux/store';
import { useEffect, useState, useRef } from 'react';
import {
  DialogActions,
  MessageActions,
  UserActions,
} from '../../redux/actions';
import socket from './../../core/socket';
import Actions from '../../redux/actions/messages';
import { IDialogItem } from '../../redux/reducers/dialogs';
import { formatData } from '../../components/DialogItem';
import { Recorder } from 'vmsg';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
const recorder = new Recorder({
  wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm',
});
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
const MessagePlace = () => {
  const currentDialog = useSelector(
    (state: RootState) => state.DialogsReducer.currentDialog
  );
  const currentDialogData = useSelector((state: RootState) =>
    state.DialogsReducer.items.find(
      (item: IDialogItem) => item.dialog_id === currentDialog
    )
  );
  const messageData = useSelector(
    (state: RootState) => state.messagesReducer.items
  );
  const dialogData = useSelector(
    (state: RootState) => state.DialogsReducer.items
  );
  const currentUser = useSelector(
    (state: RootState) => state.UserReducer.currentUser.id
  );
  const [inputValue, setInputValue] = useState('');
  const dispatch = useAppDispatch();
  const [image, setImage] = useState('');
  const [loadingAudio, isLoadingAudio] = useState(false);
  const [recording, isRecording] = useState(false);

  const messageRef = useRef<HTMLElement>(null);
  const [loading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const onEmojiClick = (emojiObject: EmojiClickData, e: MouseEvent) => {
    setInputValue((prevValue) => prevValue + emojiObject.emoji);
    setShowPicker(false);
  };
  useEffect(() => {
    socket.on('UPDATE_READ_MESSAGE', (data) => {
      dispatch(
        MessageActions.updateReadMessage(
          store.getState().messagesReducer.items,
          data
        )
      );
    });

    socket.on('GET_DELETED_DIALOG', (data) => {
      dispatch(DialogActions.deleteDialog(data.dialog_id));
      dispatch(MessageActions.deleteMessageFromDialog(data.dialog_id));
    });
    socket.on('GET_DELETED_MESSAGE', (data) => {
      dispatch(Actions.deleteMessage(data.message_id));
    });
    if (socket.id) return;
    socket.on('UPDATE_MESSAGE', (data) => {
      if (data.dialogid === store.getState().DialogsReducer.currentDialog) {
        //   let reader = new FileReader();
        //   for (let i = 0; i < data.length; i++) {
        //     if (data[i].audio === '') return;
        //     console.log(data[i].audio);
        //     reader.readAsDataURL(data[i].audio);
        //     reader.onload = function () {
        //       data[i].audio = reader.result;
        //     };
        //   }
        dispatch(
          Actions.updateMessages([
            {
              ...data,
              partnerid: data.dialogChar.partner,
              authorid: data.dialogChar.author,
            },
          ])
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoading(false);
    if (!currentDialog) return;

    socket.emit('MESSAGE_READ_UPDATE', {
      dialog_id: currentDialog,
      currentUser,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageData]);
  useEffect(() => {
    setIsLoading(true);
    dispatch(MessageActions.asyncsetMessages(currentDialog));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDialog]);

  if (loading) {
    return (
      <div className={style.spinner}>
        <Spin size="large" />
      </div>
    );
  }
  const removeItem = () => {
    socket.emit('DELETE_DIALOG', { dialogid: currentDialog });
  };
  const goToMain = () => {
    dispatch(DialogActions.setCurrentDialog(0));
  };
  const recordVoice = async () => {
    isLoadingAudio(true);
    //если запись уже идет-отключаем
    if (recording) {
      const blob = await recorder.stopRecording();
      isRecording(false);
      isLoadingAudio(false);
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function () {
        let sendedat = String(new Date());
        socket.emit('SEND_MESSAGE', {
          textdata: '',
          userid: currentUser,
          dialogid: currentDialog,
          sendedat: sendedat,
          isRead: false,
          attachments: '',
          audio: String(reader.result),
        });
        // setRecordingData(String(reader.result)); // url с данными
      };
    } else {
      try {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        isLoadingAudio(false);
        isRecording(true);
      } catch (e) {
        console.log(e);
        isLoadingAudio(false);
      }
    }
  };
  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setImage(url);
      });
    }
  };
  const Logout = () => {
    dispatch(UserActions.setAsyncLogout(currentUser));
    const last_seen = formatData(String(new Date()));
    socket.emit('LOGOUT', { currentUser, last_seen });
  };
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue(e.target.value);
  };
  const sendMessage = () => {
    // if (inputValue.trim() !== '' || image === '') {
    let sendedat = String(new Date());
    socket.emit('SEND_MESSAGE', {
      textdata: inputValue,
      userid: currentUser,
      dialogid: currentDialog,
      sendedat: sendedat,
      isRead: false,
      attachments: image,
    });
    setImage('');
    // }
    socket.emit('UPDATE_DIALOG_UNREAD_MESSAGES', {
      dialogid: currentDialog,
    });
    socket.emit('UPDATE_DIALOG_LAST_MESSAGE', {
      newText: inputValue,
      dialogid: currentDialog,
      updatedat: String(new Date()),
    });

    // socket.emit('UPDATE_DIALOG_UNREAD_MESSAGES', {
    //   dialogid: currentDialog,
    // });
    setInputValue('');
  };
  return (
    <>
      {currentDialogData ? (
        <header className={style.current_dialog_header}>
          <Avatar
            {...(currentUser === currentDialogData.authorid.user_id
              ? currentDialogData.partnerid
              : currentDialogData.authorid)}
          />
          <div className={style.header_info}>
            <h1>
              {currentUser === currentDialogData.authorid.user_id
                ? currentDialogData.partnerid.fullname
                : currentDialogData.authorid.fullname}
            </h1>
            <span>
              {currentUser === currentDialogData.authorid.user_id
                ? currentDialogData.partnerid.last_seen
                : currentDialogData.authorid.last_seen}
            </span>
          </div>
          <div className={style.header_icons}>
            <StarOutlined />
            <Popover
              content={
                <div>
                  <Button onClick={removeItem}>Удалить диалог</Button>
                  <Button onClick={goToMain}>Вернуться в меню</Button>
                </div>
              }
              trigger="click"
            >
              <div className={style.message__icon_actions}>
                <Button type="link" shape="circle" icon={<MoreOutlined />} />
              </div>
            </Popover>
          </div>
        </header>
      ) : (
        <header className={style.current_dialog_header_empty}>
          <div className={style.header_info}>
            <h1>Select chat to communicate with your friends!</h1>
          </div>
          <div className={style.exit}>
            <Popover
              content={
                <div>
                  <Button onClick={() => Logout()}>Выйти из аккаунта</Button>
                </div>
              }
              trigger="click"
            >
              <div className={style.message__icon_actions}>
                <Button type="link" shape="circle" icon={<LogoutOutlined />} />
              </div>
            </Popover>
          </div>
        </header>
      )}

      {messageData.length > 0 ? (
        <main className={style.messages} ref={messageRef}>
          {messageData.map((item: any) => {
            return <Message {...item} key={item.message_id} />;
          })}
        </main>
      ) : (
        <div className={style.empty}>
          <Empty />
        </div>
      )}
      {currentDialog ? (
        <div className={style.input_block}>
          <Input
            allowClear
            value={inputValue}
            style={{ width: 700 }}
            onChange={onChange}
            size="large"
            placeholder="Введите сообщение"
            prefix={<SearchOutlined />}
          />
          <div className={style.emoji}>
            <div
              onClick={() => recordVoice()}
              className={`${style.icon} ${
                loading ? style.icon_audio_disabled : ''
              } ${recording ? style.icon_audio_recording : ''}`}
            >
              <AudioOutlined />
            </div>
            <div
              className={style.icon}
              onClick={() => setShowPicker((state) => !state)}
            >
              <SmileOutlined />
            </div>

            <div className={style.icon}>
              <Popover
                content={
                  <div>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture"
                      maxCount={1}
                      onChange={handleChange}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </div>
                }
                trigger="click"
              >
                <div className={style.message__icon_actions}>
                  <Button
                    type="link"
                    shape="circle"
                    icon={<UploadOutlined />}
                  />
                </div>
              </Popover>
            </div>
            <div className={style.icon} onClick={sendMessage}>
              <SendOutlined />
            </div>
          </div>
          {showPicker && (
            <div className={style.picker_container}>
              <EmojiPicker
                width={'35rem'}
                height={'35rem'}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default MessagePlace;
