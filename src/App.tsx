import React from 'react';
import { Home } from './pages';
import style from './App.module.scss';
import { Auth } from './pages/index';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { AuthHttp } from './http';

const App: React.FC = () => {
  const isAuth = useSelector((state: RootState) => state.authReducer.isAuth);
  useEffect(() => {
    AuthHttp.checkAuth();
  }, []);
  return (
    <div className={style.app_wrapper}>{isAuth ? <Home /> : <Auth />}</div>
  );
};

export default App;
