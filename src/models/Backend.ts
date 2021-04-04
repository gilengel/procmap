import { ServerSingleResponse, ServerMultipleResponse } from './ServerResponse';
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

export function GetOne<Type>(url: String): Promise<Type> {
  return new Promise((resolve, reject) => {
    axios
      .request<Type>({
        url: `${BACKEND_URL}/${url}`,
      })
      .then(function (response) {
        resolve(response.data)
      })
      .catch(function (error) {
        reject(error)
      });
  })
}

export function GetMultiple<Type>(url: String): Promise<ServerMultipleResponse<Type>> {
  return new Promise((resolve, reject) => {
    axios
      .request<Type>({
        url: `${BACKEND_URL}/${url}`,
      })
      .then(function (response) {
        resolve(response as unknown as ServerMultipleResponse<Type>)
      })
      .catch(function (error) {
        reject(error)
      });
  })
}

export function PostOne<Type>(url: String, model: Type): Promise<ServerSingleResponse<Type>> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BACKEND_URL}/${url}`, model)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      });
  })
}

export function PostMultiple<Type>(url: String, model: Type): Promise<ServerMultipleResponse<Type>> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BACKEND_URL}/${url}`, model)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      });
  })
}

export function UpdateOne<Type>(url: String, model: Type): Promise<ServerSingleResponse<Type>> {
  return new Promise((resolve, reject) => {
    axios
      .put(`${BACKEND_URL}/${url}`, model)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      });
  })
}
