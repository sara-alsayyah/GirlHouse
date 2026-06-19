"use client";

import { useMemo, useState } from "react";
import { AdminContainer } from "../components/AdminContainer";
import { OrdersStats } from "./components/OrdersStats";
import { OrdersFilters } from "./components/OrdersFilters";
import { OrdersTable } from "./components/OrdersTable";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EditOrderModal } from "./components/EditOrderModal";
import { AdminOrder } from "../types/orders";
import { ordersMock, ordersStats } from "../data/ordersMock";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const filteredOrders = useMemo(() => {
    return ordersMock.filter((order) => {
      const matchesSearch = order.customer_email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleDelete = () => {
    console.log("Delete order:", orderToDelete);

    // Later:
    // await deleteOrder(orderToDelete)

    setOrderToDelete(null);
  };

  const handleSaveOrder = (updatedOrder: AdminOrder) => {
    console.log("Updated order:", updatedOrder);

    // Later:
    // await updateOrder(updatedOrder.id, updatedOrder);

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

        <OrdersFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        <OrdersTable
          orders={filteredOrders}
          onDeleteClick={setOrderToDelete}
          onEditClick={setSelectedOrder}
        />
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
