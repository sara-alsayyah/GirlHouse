import { StoreSettings } from "../../types/settings";

interface Props {
  settings: StoreSettings;
}

export function StoreSettingsForm({ settings }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold text-[#4b343a]">
        Store Information
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        <input
          defaultValue={settings.store_name}
          className="h-12 rounded-xl border border-[#ead9dd] px-4"
        />

        <input
          defaultValue={settings.support_email}
          className="h-12 rounded-xl border border-[#ead9dd] px-4"
        />

        <input
          defaultValue={settings.phone}
          className="h-12 rounded-xl border border-[#ead9dd] px-4"
        />

        <input
          defaultValue={settings.address}
          className="h-12 rounded-xl border border-[#ead9dd] px-4"
        />
      </div>
    </div>
  );
}
