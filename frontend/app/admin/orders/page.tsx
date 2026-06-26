"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminContainer } from "../components/AdminContainer";
import { OrdersStats } from "./components/OrdersStats";
import { OrdersFilters } from "./components/OrdersFilters";
import { OrdersTable } from "./components/OrdersTable";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EditOrderModal } from "./components/EditOrderModal";
import { AdminOrder } from "../types/orders";
import {
  adminGetOrders,
  asArray,
  cancelOrder,
  getApiErrorMessage,
  getOrdersStats,
  getStoredAccessToken,
  updateOrderStatus,
} from "@/app/lib/api";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError("Please log in as an admin to manage orders.");
      setLoading(false);
      return;
    }

    adminGetOrders(token)
      .then((payload) => {
        setOrders(asArray(payload).map((order) => ({
          ...order,
          customer_email: order.customer_email ?? (order as unknown as { customer?: string }).customer ?? "",
          items_count: order.items_count ?? 0,
          total_price: Number(order.total_price),
        })));
        setError("");
      })
      .catch((error) => setError(getApiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.customer_email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, orders]);

  const ordersStats = useMemo(() => getOrdersStats(orders), [orders]);

  const handleDelete = async () => {
    const token = getStoredAccessToken();
    if (!token || orderToDelete === null) return;
    try {
      await cancelOrder(token, orderToDelete);
      setOrders((current) =>
        current.map((order) =>
          order.id === orderToDelete ? { ...order, status: "cancelled" } : order,
        ),
      );
    } catch (error) {
      setError(getApiErrorMessage(error));
    }
    setOrderToDelete(null);
  };

  const handleSaveOrder = async (updatedOrder: AdminOrder) => {
    const token = getStoredAccessToken();
    if (!token) return;
    try {
      if (updatedOrder.status === "cancelled") {
        await cancelOrder(token, updatedOrder.id);
      } else {
        await updateOrderStatus(token, updatedOrder.id, updatedOrder.status);
      }
      setOrders((current) =>
        current.map((order) =>
          order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order,
        ),
      );
    } catch (error) {
      setError(getApiErrorMessage(error));
    }
    setSelectedOrder(null);
  };
  return (
    <AdminContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#4b343a]">Orders</h1>

          <p className="mt-2 text-[#8f727a]">
            Manage customer orders and shipments
          </p>
        </div>

        <OrdersStats stats={ordersStats} />

        {error && (
          <div className="rounded-[18px] border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <OrdersFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        {loading ? (
          <div className="h-72 animate-pulse rounded-[28px] bg-white" />
        ) : (
          <OrdersTable
          orders={filteredOrders}
          onDeleteClick={setOrderToDelete}
          onEditClick={setSelectedOrder}
          />
        )}
      </div>
      <ConfirmDeleteModal
        isOpen={orderToDelete !== null}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
        onCancel={() => setOrderToDelete(null)}
        onConfirm={handleDelete}
      />
      <EditOrderModal
        isOpen={selectedOrder !== null}
        order={selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        onSave={handleSaveOrder}
      />
    </AdminContainer>
  );
}
