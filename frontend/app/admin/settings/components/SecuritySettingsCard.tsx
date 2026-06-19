import { SecuritySettings } from "../../types/settings";

interface Props {
  settings: SecuritySettings;
}

export function SecuritySettingsCard({ settings }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold text-[#4b343a]">Security</h2>

      <label className="flex items-center justify-between">
        <span>Two Factor Authentication</span>

        <input type="checkbox" defaultChecked={settings.two_factor_auth} />
      </label>
    </div>
  );
}
