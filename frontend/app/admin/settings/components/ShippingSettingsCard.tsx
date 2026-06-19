import { ShippingSettings } from "../../types/settings";

interface Props {
  settings: ShippingSettings;
}

export function ShippingSettingsCard({ settings }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold text-[#4b343a]">Shipping</h2>

      <div className="space-y-4">
        <input
          type="number"
          defaultValue={settings.free_shipping_threshold}
          className="h-12 w-full rounded-xl border border-[#ead9dd] px-4"
          placeholder="Free shipping threshold"
        />

        <input
          type="number"
          defaultValue={settings.standard_shipping_fee}
          className="h-12 w-full rounded-xl border border-[#ead9dd] px-4"
          placeholder="Shipping fee"
        />
      </div>
    </div>
  );
}
