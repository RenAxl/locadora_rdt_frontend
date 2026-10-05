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

  POSITIONS: {
    ROOT: `${BASE_URL}/positions`,
    BY_ID: (id: number | string) => `${BASE_URL}/positions/${id}`,
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

  CATEGORIES: {
    ROOT: `${BASE_URL}/rental/categories`,
    BY_ID: (id: number | string) => `${BASE_URL}/rental/categories/${id}`,
    DELETE_ALL: `${BASE_URL}/rental/categories/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/rental/categories/${id}/active`,
    IMAGE: (id: number) => `${BASE_URL}/rental/categories/${id}/image`,
  },

  ITEMS: {
    ROOT: `${BASE_URL}/inventory/items`,
    BY_ID: (id: number | string) => `${BASE_URL}/inventory/items/${id}`,
    DELETE_ALL: `${BASE_URL}/inventory/items/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/inventory/items/${id}/active`,
    IMAGE: (id: number) => `${BASE_URL}/inventory/items/${id}/image`,
  },

  ITEM_UNITS: {
    ROOT: `${BASE_URL}/inventory/item-units`,
    BY_ID: (id: number | string) => `${BASE_URL}/inventory/item-units/${id}`,
    DELETE_ALL: `${BASE_URL}/inventory/item-units/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/inventory/item-units/${id}/active`,
  },

  STOCK_BALANCES: {
    ROOT: `${BASE_URL}/inventory/stock-balances`,
    BY_ID: (id: number | string) => `${BASE_URL}/inventory/stock-balances/${id}`,
    BY_ITEM: (itemId: number | string) => `${BASE_URL}/inventory/stock-balances/item/${itemId}`,
    UPDATE_MINIMUM: (id: number) => `${BASE_URL}/inventory/stock-balances/${id}/minimum`,
  },

  PAYABLES: {
    ROOT: `${BASE_URL}/payables`,
    BY_ID: (id: number | string) => `${BASE_URL}/payables/${id}`,
    PAY: (id: number) => `${BASE_URL}/payables/${id}/payments`,
    REPORT: `${BASE_URL}/payables/report`,
    FILES: {
      ROOT: (payableId: number) => `${BASE_URL}/payables/${payableId}/files`,
      BY_ID: (payableId: number, fileId: number) => `${BASE_URL}/payables/${payableId}/files/${fileId}`,
      VIEW: (payableId: number, fileId: number) => `${BASE_URL}/payables/${payableId}/files/${fileId}/view`,
      DOWNLOAD: (payableId: number, fileId: number) => `${BASE_URL}/payables/${payableId}/files/${fileId}/download`,
    },
  },

  RECEIVABLES: {
    ROOT: `${BASE_URL}/receivables`,
    BY_ID: (id: number | string) => `${BASE_URL}/receivables/${id}`,
    PAY: (id: number) => `${BASE_URL}/receivables/${id}/payments`,
    REPORT: `${BASE_URL}/receivables/report`,
    RECEIPT: (id: number) => `${BASE_URL}/receivables/${id}/receipt`,
    FISCAL_COUPON: (id: number) => `${BASE_URL}/receivables/${id}/fiscal-coupon`,
    FILES: {
      ROOT: (receivableId: number) => `${BASE_URL}/receivables/${receivableId}/files`,
      BY_ID: (receivableId: number, fileId: number) => `${BASE_URL}/receivables/${receivableId}/files/${fileId}`,
      VIEW: (receivableId: number, fileId: number) => `${BASE_URL}/receivables/${receivableId}/files/${fileId}/view`,
      DOWNLOAD: (receivableId: number, fileId: number) => `${BASE_URL}/receivables/${receivableId}/files/${fileId}/download`,
    },
  },

  PAYMENT_METHODS: {
    ROOT: `${BASE_URL}/payment-methods`,
    BY_ID: (id: number | string) => `${BASE_URL}/payment-methods/${id}`,
    DELETE_ALL: `${BASE_URL}/payment-methods/all`,
  },

  PAYMENT_FREQUENCIES: {
    ROOT: `${BASE_URL}/payment-frequencies`,
    BY_ID: (id: number | string) => `${BASE_URL}/payment-frequencies/${id}`,
    DELETE_ALL: `${BASE_URL}/payment-frequencies/all`,
  },

  EMPLOYEES: {
    ROOT: `${BASE_URL}/employees`,
    BY_ID: (id: number | string) => `${BASE_URL}/employees/${id}`,
    DELETE_ALL: `${BASE_URL}/employees/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/employees/${id}/active`,
    PHOTO: (id: number) => `${BASE_URL}/employees/${id}/photo`,
    FILES: {
      ROOT: (employeeId: number) => `${BASE_URL}/employees/${employeeId}/files`,
      BY_ID: (employeeId: number, fileId: number) => `${BASE_URL}/employees/${employeeId}/files/${fileId}`,
      VIEW: (employeeId: number, fileId: number) => `${BASE_URL}/employees/${employeeId}/files/${fileId}/view`,
      DOWNLOAD: (employeeId: number, fileId: number) => `${BASE_URL}/employees/${employeeId}/files/${fileId}/download`,
    },
  },

  SUPPLIERS: {
    ROOT: `${BASE_URL}/suppliers`,
    BY_ID: (id: number | string) => `${BASE_URL}/suppliers/${id}`,
    IMAGE: (id: number) => `${BASE_URL}/suppliers/${id}/image`,
    FILES: {
      ROOT: (supplierId: number) => `${BASE_URL}/suppliers/${supplierId}/files`,
      BY_ID: (supplierId: number, fileId: number) => `${BASE_URL}/suppliers/${supplierId}/files/${fileId}`,
      VIEW: (supplierId: number, fileId: number) => `${BASE_URL}/suppliers/${supplierId}/files/${fileId}/view`,
      DOWNLOAD: (supplierId: number, fileId: number) => `${BASE_URL}/suppliers/${supplierId}/files/${fileId}/download`,
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

  FINANCIAL_SETTINGS: {
    ROOT: `${BASE_URL}/financial-settings`,
  },

  FINANCIAL_REPORTS: {
    GENERATE: (reportType: string, format: string) =>
      `${BASE_URL}/reports/financial-reports/${reportType}/${format}`,
    COMPARISON: `${BASE_URL}/reports/financial-reports/comparison`,
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
