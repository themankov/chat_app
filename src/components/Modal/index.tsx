import React, { useState } from 'react';
import { Modal } from 'antd';
import Button from '../Button';
import { Select } from '..';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import socket from '../../core/socket';
import { DialogActions } from '../../redux/actions';
const ModalPage = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.UserReducer.currentUser.id
  );
  const [selectedUser, setSelectedUser] = useState('');
  const dialogusers = useSelector(
    (state: RootState) => state.DialogsReducer.items
  );
  const uploadMessage = () => {
    try {
      const parsedData = JSON.parse(selectedUser);
      const isExist = dialogusers.find(
        (item) =>
          item.partnerid.user_id === parsedData.id ||
          item.authorid.user_id === parsedData.id
      );
      if (selectedUser && !isExist) {
        socket.emit('CREATE_DIALOG', {
          textData: '',
          authorId: currentUser,
          partnerId: parsedData.id,
          updatedAt: String(new Date()),
          userId: currentUser,
        });
      } else if (isExist) {
        dispatch(DialogActions.setCurrentDialog(isExist.dialog_id));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <Button
        className=""
        type="primary"
        size="large"
        onClick={() => setOpen(true)}
        htmlType="button"
      >
        Начать новый диалог
      </Button>
      <Modal
        title="Введиите имя вашего нового друга"
        style={{ left: 20 }}
        open={open}
        onOk={() => uploadMessage()}
        onCancel={() => setOpen(false)}
      >
        <Select setSelectedUser={setSelectedUser} />
      </Modal>
    </>
  );
};
export default ModalPage;
