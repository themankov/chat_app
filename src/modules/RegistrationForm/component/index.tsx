import style from './Register.module.scss';
import { Checkbox, Form, Input, InputProps } from 'antd';
import { Link } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { Button } from '../../../components';
import { AuthHttp } from '../../../http';

export interface FormValues {
  remember?: boolean;
  email: string;
  fullname: string;
  password: string;
}

const RegisterForm = (props: FormikProps<FormValues>) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    touched,
    errors,
    isSubmitting,

    isValid,
    values,
    handleBlur,
    handleChange,
  } = props;

  const onFinish = (values: FormValues) => {
    if (values.remember && values.email) {
      const serialObj = JSON.stringify(values);
      localStorage.setItem('data', serialObj);
    }
    if (localStorage.getItem('data')) {
      const data = localStorage.getItem('data');
      const dataObj = data ? JSON.parse(data) : '';
      AuthHttp.register(dataObj.email, dataObj.password, dataObj.fullname);
      setIsSuccess(true);
      return;
    }
    AuthHttp.register(values.email, values.password, values.fullname);
    setIsSuccess(true);
  };
  useEffect(() => {
    const inputElement: any = document.forms[0].elements;
    inputElement[0].value = values.fullname;
    inputElement[1].value = values.email;
    inputElement[2].value = values.password;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style.registration_form}>
      {isSuccess ? (
        <div className={style.success_wrapper}>
          <InfoCircleOutlined />
          <p>Пожалуйста подтвердите почту</p>
        </div>
      ) : (
        <div>
          <div className={style.registartion_header}>
            <h1>Registration</h1>
            <p>Hey, Enter your details to sign in to your account</p>
          </div>

          <Form
            name="basic"
            labelCol={{ span: 5 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onFinish}
          >
            <Form.Item
              label="Fullname"
              wrapperCol={{ offset: 1 }}
              name="fullname"
            >
              <Input
                onChange={handleChange}
                name="fullname"
                onBlur={handleBlur}
                value={values.fullname}
              />
            </Form.Item>
            {touched.fullname && errors.fullname && (
              <div className={style.error}>{errors.fullname}</div>
            )}

            <Form.Item
              label=" Your Email"
              name="email"
              wrapperCol={{ offset: 1 }}
            >
              <Input
                value={values.email}
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>
            {touched.email && errors.email && (
              <div className={style.error}>{errors.email}</div>
            )}

            <Form.Item
              label="Password"
              name="password"
              wrapperCol={{ offset: 1 }}
            >
              <Input.Password
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
            </Form.Item>
            {touched.password && errors.password && (
              <div className={style.error}>{errors.password}</div>
            )}

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                size="large"
                className="button_form"
                htmlType="submit"
                disabled={!isValid || isSubmitting}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
          <div className={style.register_links}>
            <Link to="/login">Have already register?</Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default RegisterForm;
