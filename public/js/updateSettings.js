/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

//type is password or data
export const updateUserSettings = async (data, type) => {
  const url =
    type === 'password'
      ? '/api/v1/users/updateMyPassword'
      : '/api/v1/users/updateMe';
  try {
    const res = await axios.patch(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.data.status === 'Success') {
      showAlert('success', `${type.toUpperCase()} updated successfull`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
    window.setTimeout(() => {
      location.reload(true);
    }, 1500);
  }
};
