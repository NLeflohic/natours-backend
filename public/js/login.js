/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:3000/api/v1/users/signin', {
      email,
      password,
    });

    if (res.data.status === 'Success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  console.log('click');
  try {
    const res = await axios.get('http://localhost:3000/api/v1/users/signout');
    if (res.data.status === 'Success') location.reload(true);
  } catch (error) {
    showAlert('Error', 'Error logging out, try again');
  }
};
