import { withFormik } from 'formik';

import { FormValues } from '../index';

import * as yup from 'yup';
import LoginForm from '..';
interface IProps {
  email?: string;
  password?: string;
  remember?: boolean;
}
export const FormikForm = withFormik<IProps, FormValues>({
  mapPropsToValues: (props) => {
    const dataStorage = localStorage.getItem('data');
    const data = dataStorage ? JSON.parse(dataStorage) : undefined;

    return {
      email: data?.email || null,
      password: data?.password || null,
    };
  },
  validationSchema: yup.object().shape({
    email: yup
      .string()
      .email('You need an email')
      .required('You really need it'),
    password: yup
      .string()
      .min(4, 'Password must be at least 4 character')
      .required('Password is required'),
  }),
  handleSubmit: () => {
    console.log('Disabled handler');
  },
  displayName: 'Basic Form',
})(LoginForm);
