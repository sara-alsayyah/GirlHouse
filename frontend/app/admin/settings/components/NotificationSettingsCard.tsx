import { NotificationSettings } from "../../types/settings";

interface Props {
  settings: NotificationSettings;
}

export function NotificationSettingsCard({ settings }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold text-[#4b343a]">
        Notifications
      </h2>

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span>Order Emails</span>

          <input type="checkbox" defaultChecked={settings.order_emails} />
        </label>

        <label className="flex items-center justify-between">
          <span>Review Notifications</span>

          <input
            type="checkbox"
            defaultChecked={settings.review_notifications}
          />
        </label>
      </div>
    </div>
  );
}
