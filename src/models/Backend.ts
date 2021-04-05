import { ServerSingleResponse, ServerMultipleResponse } from './ServerResponse';
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

export const LAYOUTS_URL = "layout";
export const PAGES_URL = "pages";
export const PAGE_CONNECTIONS_URL = "page_connection";
export const TEMP_FLOW = "temp_flow";

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

export function GetMultiple<Type>(url: String): Promise<Array<Type>> {
  return new Promise((resolve, reject) => {
    axios
      .request<Array<Type>>({
        url: `${BACKEND_URL}/${url}`,
      })
      .then(function (response) {
        resolve(response.data.content)
      })
      .catch(function (error) {
        reject(error)
      });
  })
}

export function PostOne<Type, ReturnType>(url: String, model: Type): Promise<ReturnType> {
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

export function PostMultiple<Type>(url: String, model: Type): Promise<Array<Type>> {
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
