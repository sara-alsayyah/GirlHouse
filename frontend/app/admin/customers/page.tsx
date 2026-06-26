"use client";

import { useMemo, useState, useEffect } from "react";
import { AdminContainer } from "../components/AdminContainer";
import { CustomersStats } from "./components/CustomersStats";
import { CustomersFilters } from "./components/CustomersFilters";
import { CustomersTable } from "./components/CustomersTable";
import {
  adminGetCustomers,
  asArray,
  getApiErrorMessage,
  getCustomersStats,
  getStoredAccessToken,
  updateCustomerStatus,
} from "@/app/lib/api";
import type { AdminCustomer } from "../types/customers";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError("Please log in as an admin to manage customers.");
      setLoading(false);
      return;
    }

    adminGetCustomers(token)
      .then((payload) => {
        setCustomers(asArray(payload).map((customer) => ({
          ...customer,
          total_orders: Number(customer.total_orders),
          total_spent: Number(customer.total_spent),
        })));
        setError("");
      })
      .catch((error) => setError(getApiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        customer.email.toLowerCase().includes(search) ||
        (customer.phone ?? "").toLowerCase().includes(search);

      const isAdmin = customer.is_staff;
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "admin" && isAdmin) ||
        (roleFilter === "customer" && !isAdmin);

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const customersStats = useMemo(() => getCustomersStats(customers), [customers]);

  const handleStatusChange = async (customerId: number, newStatus: boolean) => {
    const token = getStoredAccessToken();
    if (!token) return;
    try {
      const updated = await updateCustomerStatus(token, customerId, newStatus);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === customerId
            ? { ...customer, is_active: updated.is_active }
            : customer,
        ),
      );
    } catch (error) {
      setError(getApiErrorMessage(error));
    }
  };

  return (
    <AdminContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#4b343a]">Customers</h1>

          <p className="mt-2 text-[#8f727a]">
            Manage users and customer accounts
          </p>
        </div>

        <CustomersStats stats={customersStats} />

        {error && (
          <div className="rounded-[18px] border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <CustomersFilters
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          onSearchChange={setSearchTerm}
          onRoleChange={setRoleFilter}
        />

        {loading ? (
          <div className="h-72 animate-pulse rounded-[28px] bg-white" />
        ) : (
          <CustomersTable
          customers={filteredCustomers}
          onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </AdminContainer>
  );
}
