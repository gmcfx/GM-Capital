// src/context/PaymentContext.tsx
import { 
  createContext, 
  useContext, 
  useState, 
  type ReactNode,
  useEffect
} from 'react';
import { 
  createPayment, 
  getPaymentStatus, 
  getAvailableCurrencies
} from '@/services/paymentService';
import { useAuth } from './AuthContext';
import { ref, onValue, off, set, update } from 'firebase/database';
import { getRealtimeDB } from '@/lib/firebase';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
  userId: string;
  paymentProvider: string;
  providerId: string;
}

interface PaymentContextType {
  payments: Payment[];
  currencies: string[];
  isLoading: boolean;
  error: string | null;
  initPayment: (amount: number, currency: string) => Promise<any>;
  checkPaymentStatus: (paymentId: string) => Promise<any>;
  fetchCurrencies: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const db = getRealtimeDB();

  // Setup realtime payments listener
  useEffect(() => {
    if (!user) {
      setPayments([]);
      return;
    }
    
    const paymentsRef = ref(db, `payments/${user.uid}`);
    const paymentListener = onValue(paymentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const paymentsData: Payment[] = [];
        snapshot.forEach((childSnapshot) => {
          const payment = childSnapshot.val();
          paymentsData.push({
            id: childSnapshot.key as string,
            ...payment
          });
        });
        setPayments(paymentsData);
      } else {
        setPayments([]);
      }
    });

    return () => off(paymentsRef, 'value', paymentListener);
  }, [user, db]);

  const initPayment = async (amount: number, currency: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('User must be logged in to make a payment');
      }
      
      const orderId = `GMC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create payment with NowPayments
      const paymentData = await createPayment({
        price_amount: amount,
        price_currency: 'usd',
        pay_currency: currency,
        ipn_callback_url: `${window.location.origin}/api/payment/webhook`,
        order_id: orderId,
        order_description: `Deposit to GM Capital Account`
      });

      // Create full payment object
      const newPayment: Payment = {
        id: paymentData.payment_id,
        amount,
        currency,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: user.uid,
        paymentProvider: 'nowpayments',
        providerId: paymentData.payment_id
      };
      
      // Save directly to Firebase
      const paymentRef = ref(db, `payments/${user.uid}/${newPayment.id}`);
      await set(paymentRef, newPayment);
      
      return paymentData;
    } catch (err: any) {
      setError(err.message || 'Payment initialization failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('User must be logged in to check payment status');
      }
      
      // Get status from NowPayments API
      const status = await getPaymentStatus(paymentId);
      const statusValue = status.payment_status as 'pending' | 'confirmed' | 'failed';
      
      // Update in Firebase
      const paymentRef = ref(db, `payments/${user.uid}/${paymentId}`);
      await update(paymentRef, { status: statusValue });
      
      return status;
    } catch (err: any) {
      setError(err.message || 'Payment status check failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    if (currencies.length > 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get available currencies from NowPayments
      const currenciesData = await getAvailableCurrencies();
      setCurrencies(currenciesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch currencies');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaymentContext.Provider value={{
      payments,
      currencies,
      isLoading,
      error,
      initPayment,
      checkPaymentStatus,
      fetchCurrencies
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};