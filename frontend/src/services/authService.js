import api from '../api/axios';

const forgotPassword = async (email) => {
  const response = await api.post('accounts/forgot-password/', { email });
  return response.data;
};

const resetPassword = async (uid, token, password) => {
  const response = await api.post(`accounts/reset-password/${uid}/${token}/`, { password });
  return response.data;
};

export default {
  forgotPassword,
  resetPassword,
};
