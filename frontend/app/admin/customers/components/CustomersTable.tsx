import { AdminCustomer } from "../../types/customers";
import { CustomerStatusBadge } from "./CustomerStatusBadge";

interface Props {
  customers: AdminCustomer[];
  onStatusChange?: (customerId: number, newStatus: boolean) => void;
}

export function CustomersTable({ customers, onStatusChange }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0e0e4]">
              <th className="px-4 py-4 text-left">ID</th>
              <th className="px-4 py-4 text-left">Email</th>
              <th className="px-4 py-4 text-left">Phone</th>
              <th className="px-4 py-4 text-left">Orders</th>
              <th className="px-4 py-4 text-left">Spent</th>
              <th className="px-4 py-4 text-left">Role</th>
              <th className="px-4 py-4 text-left">Status</th>
              <th className="px-4 py-4 text-left">Joined</th>
              <th className="px-4 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-[#f7ecef]">
                <td className="px-4 py-5">{customer.id}</td>

                <td className="px-4 py-5">{customer.email}</td>

                <td className="px-4 py-5">{customer.phone ?? "-"}</td>

                <td className="px-4 py-5">{customer.total_orders}</td>

                <td className="px-4 py-5">${customer.total_spent}</td>

                <td className="px-4 py-5">
                  {customer.is_staff ? "Admin" : "Customer"}
                </td>

                <td className="px-4 py-5">
                  <CustomerStatusBadge active={customer.is_active} />
                </td>

                <td className="px-4 py-5">
                  {new Date(customer.date_joined).toLocaleDateString()}
                </td>
                
                <td className="px-4 py-5">
                  <button
                    onClick={() =>
                      onStatusChange?.(customer.id, !customer.is_active)
                    }
                    className={`rounded-lg p-2 transition-all duration-200 ${
                      customer.is_active
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                    title={
                      customer.is_active
                        ? "Disable Customer"
                        : "Enable Customer"
                    }
                  >
                    {customer.is_active ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
