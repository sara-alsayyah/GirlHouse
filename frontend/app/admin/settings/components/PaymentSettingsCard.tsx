import { PaymentSettings } from "../../types/settings";

interface Props {
  settings: PaymentSettings;
}

export function PaymentSettingsCard({ settings }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold text-[#4b343a]">
        Payment Methods
      </h2>

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span>Cash On Delivery</span>

          <input type="checkbox" defaultChecked={settings.cash_on_delivery} />
        </label>

        <label className="flex items-center justify-between">
          <span>Stripe Payments</span>

          <input type="checkbox" defaultChecked={settings.stripe_enabled} />
        </label>
      </div>
    </div>
  );
}
