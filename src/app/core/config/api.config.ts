import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiUrl;

export const API = {
  BASE: BASE_URL,

  LISTING_EXPORTS: {
    EXCEL: `${BASE_URL}/listing-exports/excel`,
  },

  USERS: {
    ROOT: `${BASE_URL}/users`,
    BY_ID: (id: number | string) => `${BASE_URL}/users/${id}`,
    DELETE_ALL: `${BASE_URL}/users/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/users/${id}/active`,
    ACTIVATE: `${BASE_URL}/auth/activate`,
    PHOTO: (id: number) => `${BASE_URL}/users/${id}/photo`,
  },

} as const;
