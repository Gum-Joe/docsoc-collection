import React from 'react';
import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4040', // replace with your API base URL
  //baseURL: 'http://127.0.0.1:8000/', // replace with your API base URL
  timeout: 5000, // request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AxiosContext = React.createContext(axiosInstance);
export const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
};
export const useAxios = () => React.useContext(AxiosContext);
