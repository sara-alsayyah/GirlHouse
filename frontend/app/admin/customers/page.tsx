"use client";

import { useMemo, useState, useEffect } from "react";
import { AdminContainer } from "../components/AdminContainer";
import { CustomersStats } from "./components/CustomersStats";
import { CustomersFilters } from "./components/CustomersFilters";
import { CustomersTable } from "./components/CustomersTable";

import { customersMock, customersStats } from "../data/customersMock";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [customers, setCustomers] = useState(customersMock);

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

  const handleStatusChange = (customerId: number, newStatus: boolean) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              is_active: newStatus,
            }
          : customer,
      ),
    );

    console.log("Customer:", customerId);
    console.log("New status:", newStatus);

    // Later:
    // await updateCustomerStatus(customerId, newStatus);
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

        <CustomersFilters
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          onSearchChange={setSearchTerm}
          onRoleChange={setRoleFilter}
        />

        <CustomersTable
          customers={filteredCustomers}
          onStatusChange={handleStatusChange}
        />
      </div>
    </AdminContainer>
  );
}
