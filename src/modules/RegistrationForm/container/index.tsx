import { withFormik } from 'formik';
import RegisterForm from '../component';
import { FormValues } from '../component';

import * as yup from 'yup';
interface IProps {
  fullname?: string;
  email?: string;
  password?: string;
}
export const FormikForm = withFormik<IProps, FormValues>({
  mapPropsToValues: (props) => {
    const dataStorage = localStorage.getItem('data');
    const data = dataStorage ? JSON.parse(dataStorage) : undefined;

    return {
      fullname: data?.fullname || null,
      email: data?.email || null,
      password: data?.password || null,
    };
  },
  validationSchema: yup.object().shape({
    fullname: yup.string().required("You didn't write a username"),
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
})(RegisterForm);
