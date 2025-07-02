// src/services/paymentService.ts
import { ref, set, update, query, orderByChild, equalTo, get } from 'firebase/database';
import { getRealtimeDB } from '@/lib/firebase';

const API_BASE = 'https://api.nowpayments.io/v1/';
const API_KEY = import.meta.env.VITE_NOWPAYMENTS_API_KEY;

// =====================
// Type Definitions
// =====================
export interface PaymentParams {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  ipn_callback_url: string;
  order_id: string;
  order_description: string;
}

export interface PaymentStatusResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  paymentProvider: string;
  providerId: string;
  createdAt: string;
}

// =====================
// Firebase Database Service
// =====================
const db = getRealtimeDB();

export const savePaymentToDB = async (payment: PaymentRecord) => {
  try {
    const paymentRef = ref(db, `payments/${payment.userId}/${payment.id}`);
    await set(paymentRef, payment);
    return payment;
  } catch (error) {
    console.error('Database save error:', error);
    throw new Error('Failed to save payment to database');
  }
};

export const updatePaymentStatus = async (
  userId: string,
  paymentId: string,
  status: 'pending' | 'confirmed' | 'failed'
): Promise<void> => {
  try {
    const paymentRef = ref(db, `payments/${userId}/${paymentId}`);
    await update(paymentRef, { status });
  } catch (error) {
    console.error('Payment update error:', error);
    throw new Error('Failed to update payment status');
  }
};

export const getPaymentByOrderId = async (userId: string, orderId: string): Promise<PaymentRecord | null> => {
  try {
    const paymentsRef = ref(db, `payments/${userId}`);
    const paymentsQuery = query(
      paymentsRef,
      orderByChild('providerId'),
      equalTo(orderId)
    );
    
    const snapshot = await get(paymentsQuery);
    
    if (snapshot.exists()) {
      let paymentRecord: PaymentRecord | null = null;
      snapshot.forEach(childSnapshot => {
        paymentRecord = {
          id: childSnapshot.key as string,
          ...childSnapshot.val()
        };
      });
      return paymentRecord;
    }
    return null;
  } catch (error) {
    console.error('Payment retrieval error:', error);
    throw new Error('Failed to get payment by order ID');
  }
};

// =====================
// NowPayments API Functions (using fetch)
// =====================
export const createPayment = async (params: PaymentParams): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE}payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Payment creation failed: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to create payment';
    console.error('Payment creation error:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const getPaymentStatus = async (paymentId: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await fetch(`${API_BASE}payment/${paymentId}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Payment status check failed: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to get payment status';
    console.error('Payment status error:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const getAvailableCurrencies = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE}currencies`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Currency fetch failed: ${errorData.message || response.statusText}`);
    }

    const currencies = await response.json();
    return currencies.currencies;
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to get available currencies';
    console.error('Currency fetch error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// =====================
// Webhook Utilities (For server-side use)
// =====================
interface IPNPayload {
  payment_id: string;
  payment_status: string;
  // Add other relevant fields from NowPayments IPN
}

export const handlePaymentNotification = async (payload: IPNPayload): Promise<void> => {
  try {
    const { payment_id, payment_status } = payload;
    
    if (!payment_id || !payment_status) {
      throw new Error('Invalid IPN payload');
    }

    // Map NowPayments status to our status
    const statusMap: Record<string, 'pending' | 'confirmed' | 'failed'> = {
      'waiting': 'pending',
      'confirming': 'pending',
      'confirmed': 'confirmed',
      'sending': 'confirmed',
      'partially_paid': 'pending',
      'finished': 'confirmed',
      'failed': 'failed',
      'refunded': 'failed',
      'expired': 'failed'
    };
    
    // Get mapped status or default to 'failed'
    const mappedStatus = statusMap[payment_status] || 'failed';

    // Find the payment in Firebase by providerId (NowPayments payment ID)
    const db = getRealtimeDB();
    const paymentsRef = ref(db, 'payments');
    const snapshot = await get(paymentsRef);
    
    if (snapshot.exists()) {
      const updates: Promise<void>[] = [];
      
      snapshot.forEach(userSnapshot => {
        userSnapshot.forEach(paymentSnapshot => {
          const payment = paymentSnapshot.val();
          if (payment.providerId === payment_id) {
            // Update payment status
            updates.push(
              updatePaymentStatus(payment.userId, payment.id, mappedStatus)
                .catch(e => console.error(`Failed to update payment ${payment.id}:`, e))
            );
            
            // Handle successful payment
            if (mappedStatus === 'confirmed') {
              console.log(`Payment ${payment_id} completed successfully`);
              // Add funds to user account or other business logic
            }
          }
        });
      });
      
      await Promise.all(updates);
    }
  } catch (error) {
    console.error('IPN handling error:', error);
    throw new Error('Failed to process payment notification');
  }
};