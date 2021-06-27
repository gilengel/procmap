import { ServerSingleResponse } from './ServerResponse';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

export const LAYOUTS_URL = 'layout';
export const PAGES_URL = 'pages';
export const PAGE_CONNECTIONS_URL = 'page_connection';
export const TEMP_FLOW_URL = 'temp_flow';

export function GetOne<Type>(url: string): Promise<Type> {
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

export function GetMultiple<Type>(url: string): Promise<Array<Type>> {
  return new Promise((resolve, reject) => {
    axios
      .request<Array<Type>>({
        url: `${BACKEND_URL}/${url}`,
      })
      .then((response) => {
        const { data } = response
        console.log(data)
        resolve(data)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export function PostOne<Type, ReturnType>(url: string, model: Type): Promise<ReturnType> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BACKEND_URL}/${url}`, model)
      .then(function (response) {
        resolve(response.data)
      })
      .catch(function (error) {
        reject(error)
      });
  })
}

export function PostMultiple<Type>(url: string, model: Type): Promise<Array<Type>> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BACKEND_URL}/${url}`, model)
      .then(function (response) {
        resolve(response.data)
      })
      .catch(function (error) {
        reject(error)
      });
  })
}

export function UpdateOne<Type>(url: string, model: Type): Promise<ServerSingleResponse<Type>> {
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

export function DeleteOne<Type>(url: string, id: number): Promise<Type> {
  return new Promise((resolve, reject) => {
    axios
      .delete<Type>(`${BACKEND_URL}/${url}/${id}`)
      .then((response) => {
        const { data }  = response
        console.log(data)
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      });
  })
}
