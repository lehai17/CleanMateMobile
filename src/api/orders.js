import { api } from "./axios";

export async function getOrders(userId) {
  const { data } = await api.get("/api/orders", { params: { userId } });
  return Array.isArray(data) ? data : data?.items || [];
}

export async function getRebooking(id) {
  return (await api.get(`/api/orders/${id}/rebooking`)).data;
}

export async function deleteOrder(id) {
  await api.put(`/api/orders/${id}/cancel`);
}

export async function rescheduleOrder(id, schedule) {
  return (await api.put(`/api/orders/${id}/reschedule`, schedule)).data;
}

export async function confirmOrderCompletion(id, feedback) {
  return (await api.put(`/api/orders/${id}/confirm-completion`, feedback)).data;
}

export async function updateOrder(order) {
  const { data } = await api.put(`/api/orders/${order.id}`, order);
  return data;
}
