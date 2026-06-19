import { AdminContainer } from "../components/AdminContainer";

import { settingsMock } from "../data/settingsMock";

import { StoreSettingsForm } from "./components/StoreSettingsForm";
import { ShippingSettingsCard } from "./components/ShippingSettingsCard";
import { PaymentSettingsCard } from "./components/PaymentSettingsCard";
import { NotificationSettingsCard } from "./components/NotificationSettingsCard";
import { SecuritySettingsCard } from "./components/SecuritySettingsCard";

export default function SettingsPage() {
  return (
    <AdminContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#4b343a]">Settings</h1>

          <p className="mt-2 text-[#8f727a]">
            Manage store preferences and configuration
          </p>
        </div>

        <StoreSettingsForm settings={settingsMock.store} />

        <div className="grid gap-6 lg:grid-cols-2">
          <ShippingSettingsCard settings={settingsMock.shipping} />

          <PaymentSettingsCard settings={settingsMock.payment} />

          <NotificationSettingsCard settings={settingsMock.notifications} />

          <SecuritySettingsCard settings={settingsMock.security} />
        </div>

        <div className="flex justify-end">
          <button className="rounded-xl bg-[#b78895] px-6 py-3 text-white">
            Save Changes
          </button>
        </div>
      </div>
    </AdminContainer>
  );
}
