import { AdminSettingsData } from "../types/settings";

export const settingsMock: AdminSettingsData = {
  store: {
    store_name: "Girl House",
    support_email: "support@girlhouse.com",
    phone: "+962 79 123 4567",
    address: "Amman, Jordan",
  },

  shipping: {
    free_shipping_threshold: 100,
    standard_shipping_fee: 5,
  },

  payment: {
    cash_on_delivery: true,
    stripe_enabled: true,
  },

  notifications: {
    order_emails: true,
    review_notifications: true,
  },

  security: {
    two_factor_auth: false,
  },
};
