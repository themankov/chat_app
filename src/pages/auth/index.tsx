import { Routes, Route } from 'react-router-dom';
import { ShadowBlock } from '../../components';
import PrivateRoute from '../../utils/PrivateRoute';
import { useEffect } from 'react';
import { RegisterForm, LoginForm } from './../../modules';
import style from './auth.module.scss';

const Auth: React.FC = () => {
  return (
    <div className={style.auth_wrapper}>
      <ShadowBlock>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<RegisterForm />} />
          </Route>
        </Routes>
      </ShadowBlock>
    </div>
  );
};

export default Auth;
