import axios from 'axios';
const BASE_URL = 'http://localhost:3004/api';
export const HEADER_TOKEN = 'x-auth-token';

export const login = async (email = '', password = '') => {
  const { data } = await axios.post(`${BASE_URL}/login`, {email, password});
  return data;
};
export const signup = async (email = '', password = '') => {
  const {data} = await axios.post(`${BASE_URL}/signup`, {email, password})
  return data;
};
export const getRepos = async (token) => {
  const {data} = await axios.get(
    `${BASE_URL}/repos`,
    {
      headers: {
        [HEADER_TOKEN]: token
      }
    }
  );
  return data;
};
export const createRepo = async (userName, repoName, token) => {
  const {data} = await axios.post(
    `${BASE_URL}/repos`,
    {userName, repoName},
    {
      headers: {
        [HEADER_TOKEN]: token
      }
    }
  );
  return data;
};
export const syncRepo = async (id, token) => {
  const {data} = await axios.put(
    `${BASE_URL}/repos/${id}`,
    {},
    {
      headers: {
        [HEADER_TOKEN]: token
      }
    }
  );
  return data;
};
export const deleteRepo = async (id, token) => {
  const {data} = await axios.delete(
    `${BASE_URL}/repos/${id}`,
    {
      headers: {
        [HEADER_TOKEN]: token
      }
    }
  );
  return data;
};