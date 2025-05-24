import { DeliveryStateTransition, Order, OrderStateTechnicalName, OrderStateTransition, OrderStateType, TransactionStateTransition } from '@/types/shopware.types';
import { getAuthHeader } from './auth.api';

// Use environment variables for Supabase Edge Functions URL with fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zdpboccjipkgnjjzojnc.supabase.co';
const supabaseEdgeUrl = `${supabaseUrl}/functions/v1`;

// API Services


export const fetchTransitions = async (id: string, type: OrderStateType): Promise<any> => {
    const headers = await getAuthHeader();
    const params = new URLSearchParams({ type: type });
    const response = await fetch(`${supabaseEdgeUrl}/orders/${id}/transitions?${params}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error calling edge function');
    }
    return response.json();
};


export const fetchOrder = async (id: string): Promise<Order> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${supabaseEdgeUrl}/orders/${id}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error calling edge function');
    }
    return response.json();
};

export const fetchOrders = async (state = OrderStateTechnicalName.Open): Promise<Order[]> => {
    const headers = await getAuthHeader();
    const params = new URLSearchParams({ state: state });
    const response = await fetch(`${supabaseEdgeUrl}/orders?${params}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error calling edge function');
    }

    const data = await response.json();

    // Zugriff auf das Array `data.orders.data`
    return data.orders.data;
};


export const setOrderState = async (id: string, state: OrderStateTransition): Promise<Order[]> => {
  const headers = await getAuthHeader();
  const response = await fetch(`${supabaseEdgeUrl}/orders/${id}/state`, {
      method: 'POST',
      headers,
      body: JSON.stringify({newState: state}),
  });

  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error calling edge function');
  }
  return response.json();
};

export const setPaymentState = async (id: string, state: TransactionStateTransition): Promise<Order[]> => {
  const headers = await getAuthHeader();
  const response = await fetch(`${supabaseEdgeUrl}/orders/${id}/payment-state`, {
      method: 'POST',
      headers,
      body: JSON.stringify({newState: state}),
  });

  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error calling edge function');
  }
  return response.json();
};



export const setDeliveryState = async (id: string, state: DeliveryStateTransition): Promise<Order[]> => {
  const headers = await getAuthHeader();
  const response = await fetch(`${supabaseEdgeUrl}/orders/${id}/delivery-state`, {
      method: 'POST',
      headers,
      body: JSON.stringify({newState: state}),
  });

  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error calling edge function');
  }
  return response.json();
};
