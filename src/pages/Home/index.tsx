import style from './Home.module.scss';

import { DialogsItems, MessagePlace } from '../../modules';
import { useEffect } from 'react';
import { Sidebar } from '../../components';

import { AuthHttp } from '../../http';
import socket from '../../core/socket';

import { store, useAppDispatch } from '../../redux/store';
import { UserActions } from '../../redux/actions';
import { formatData } from '../../components/DialogItem';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      window.history.pushState('data', 'string', '/');
      AuthHttp.checkAuth();
    }
    if (socket.id) return;
    socket.on('USER_OFFLINE', (data) => {
      dispatch(
        UserActions.updateUserOnline(
          store.getState().DialogsReducer.items,
          data.id,
          formatData(String(new Date()!))
        )
      );
    });

    socket.on('connect', () => {
      console.log('connected');
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className={style.home}>
      <div className={style.short_menu}>
        <Sidebar />
        <DialogsItems />
      </div>

      <>
        <div className={style.current_dialogs}></div>
        <MessagePlace />
        <div className={style.page_info}></div>
      </>
    </section>
  );
};
export default Home;
