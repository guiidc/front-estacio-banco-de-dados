'use client'

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/v1",
});

api.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

api.interceptors.response.use(function (response) {
  if (response.status === 401 && window.location.pathname !== "/login") {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

export default api;