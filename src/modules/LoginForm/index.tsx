import style from './LoginForm.module.scss';
import { Checkbox, Form, Input } from 'antd';
import { Button } from '../../components';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

import { AuthHttp } from '../../http';
import { FormikProps } from 'formik';
export interface FormValues {
  email: string;
  remember?: boolean;
  password: string;
}

const LoginForm = (props: FormikProps<FormValues>) => {
  const { values, handleChange, handleBlur } = props;
  const onFinish = (values: FormValues) => {
    if (values.remember && values.email) {
      const serialObj = JSON.stringify(values);
      localStorage.setItem('data', serialObj);
    }
    if (localStorage.getItem('data')) {
      const data = localStorage.getItem('data');
      const dataObj = data ? JSON.parse(data) : '';
      AuthHttp.login(dataObj.email, dataObj.password);
      return;
    }
    AuthHttp.login(values.email, values.password);
  };
  useEffect(() => {
    const inputElement: any = document.forms[0].elements;

    inputElement[0].value = values.email;
    inputElement[1].value = values.password;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={style.login_form}>
      <div className={style.login_header}>
        <h1>Log in</h1>
        <p>Hey, Enter your details to log in to your account</p>
      </div>

      <Form
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        labelCol={{ span: 5 }}
        onFinish={onFinish}
      >
        <Form.Item label="Email" name="email">
          <Input onChange={handleChange} onBlur={handleBlur} name="email" />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password
            onChange={handleChange}
            onBlur={handleBlur}
            name="password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            className="button"
            htmlType="submit"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
      <div className={style.login_links}>
        <Link to="/register">Haven't register yet?</Link>
      </div>
    </div>
  );
};
export default LoginForm;
