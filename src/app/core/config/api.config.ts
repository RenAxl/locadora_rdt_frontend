import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiUrl;

export const API = {
  BASE: BASE_URL,

  LISTING_EXPORTS: {
    EXCEL: `${BASE_URL}/listing-exports/excel`,
  },

  AUTH: {
    TOKEN: `${BASE_URL}/oauth/token`,
  },

  USERS: {
    ROOT: `${BASE_URL}/users`,
    BY_ID: (id: number | string) => `${BASE_URL}/users/${id}`,
    DELETE_ALL: `${BASE_URL}/users/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/users/${id}/active`,
    ACTIVATE: `${BASE_URL}/auth/activate`,
    PHOTO: (id: number) => `${BASE_URL}/users/${id}/photo`,
  },

  CUSTOMER_ACCOUNT: {
    REGISTER: `${BASE_URL}/customer-accounts`,
    CREATE_PASSWORD: `${BASE_URL}/customer-accounts/create-password`,
    RESEND_ACTIVATION: `${BASE_URL}/customer-accounts/resend-activation`,
  },

  DEPARTMENTS: {
    ROOT: `${BASE_URL}/departments`,
    BY_ID: (id: number | string) => `${BASE_URL}/departments/${id}`,
  },

  CUSTOMERS: {
    ROOT: `${BASE_URL}/customers`,
    BY_ID: (id: number | string) => `${BASE_URL}/customers/${id}`,
    DELETE_ALL: `${BASE_URL}/customers/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/customers/${id}/active`,
    PHOTO: (id: number) => `${BASE_URL}/customers/${id}/photo`,
    FILES: {
      ROOT: (customerId: number) => `${BASE_URL}/customers/${customerId}/files`,
      BY_ID: (customerId: number, fileId: number) => `${BASE_URL}/customers/${customerId}/files/${fileId}`,
      VIEW: (customerId: number, fileId: number) => `${BASE_URL}/customers/${customerId}/files/${fileId}/view`,
      DOWNLOAD: (customerId: number, fileId: number) => `${BASE_URL}/customers/${customerId}/files/${fileId}/download`,
    },
  },

  USER_PROFILE: {
    ME: `${BASE_URL}/user-profile/me`,
    PASSWORD: `${BASE_URL}/user-profile/me/password`,
    PHOTO: `${BASE_URL}/user-profile/me/photo`,
  },

  SYSTEM_SETTINGS: {
    ROOT: `${BASE_URL}/system-settings`,
  },

  ROLES: {
    ROOT: `${BASE_URL}/roles`,
    BY_ID: (id: number | string) => `${BASE_URL}/roles/${id}`,
    PERMISSIONS: (id: number | string) => `${BASE_URL}/roles/${id}/permissions`,
  },

  PERMISSIONS: {
    ROOT: `${BASE_URL}/permissions`,
    GROUPS: `${BASE_URL}/permissions/groups`,
  },

  ACTIVATE_ACCOUNT: {
    ACTIVATE: `${BASE_URL}/auth/activate`,
  },

  RECOVERY_PASSWORD: {
    REQUEST_PASSWORD_RESET: `${BASE_URL}/auth/request-password-reset`,
    PASSWORD_RESET: `${BASE_URL}/auth/password-reset`,

  },

  


} as const;
