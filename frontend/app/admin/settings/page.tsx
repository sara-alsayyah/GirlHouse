"use client";

import { useEffect, useState } from "react";
import { AdminContainer } from "../components/AdminContainer";

import { StoreSettingsForm } from "./components/StoreSettingsForm";
import { ShippingSettingsCard } from "./components/ShippingSettingsCard";
import { PaymentSettingsCard } from "./components/PaymentSettingsCard";
import { NotificationSettingsCard } from "./components/NotificationSettingsCard";
import { SecuritySettingsCard } from "./components/SecuritySettingsCard";
import { adminGetSettings, getApiErrorMessage, getStoredAccessToken } from "@/app/lib/api";
import type { AdminSettingsData } from "../types/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError("Please log in as an admin to view settings.");
      setLoading(false);
      return;
    }

    adminGetSettings(token)
      .then((data) => {
        setSettings(data);
        setError("");
      })
      .catch((error) => setError(getApiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#4b343a]">Settings</h1>

          <p className="mt-2 text-[#8f727a]">
            Manage store preferences and configuration
          </p>
        </div>

        {error && (
          <div className="rounded-[18px] border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && <div className="h-72 animate-pulse rounded-[28px] bg-white" />}

        {!loading && settings && (
          <>
            <StoreSettingsForm settings={settings.store} />

            <div className="grid gap-6 lg:grid-cols-2">
              <ShippingSettingsCard settings={settings.shipping} />

              <PaymentSettingsCard settings={settings.payment} />

              <NotificationSettingsCard settings={settings.notifications} />

              <SecuritySettingsCard settings={settings.security} />
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button className="rounded-xl bg-[#b78895] px-6 py-3 text-white">
            Save Changes
          </button>
        </div>
      </div>
    </AdminContainer>
  );
}
