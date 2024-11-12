import * as React from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"

export default function DiningDollarsPayment() {
  const router = useRouter()
  const [paymentAmount, setPaymentAmount] = React.useState<number | null>(null);
  const staffId = sessionStorage.getItem('staff_id') ? parseInt(sessionStorage.getItem('staff_id') as string) : 0;

  useEffect(() => {
    const total = sessionStorage.getItem('paymentAmount');
    if(total) {
      setPaymentAmount(parseFloat(total));
    } else {
      router.push("/customer");
    }
  }, [router]);

  const handlePaymentSuccess = async () => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentType: 'Credit Card',
          paymentAmount: paymentAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Payment processed successfully via Credit Card.');
        // sessionStorage.removeItem('paymentAmount');

        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total: paymentAmount,
            staffId: staffId,
            paymentId: data.paymentId,
          }),
        });

        const orderData = await orderResponse.json();

        if (orderData.success) {
          console.log('Order created successfully with ID:', orderData.orderId);
          sessionStorage.removeItem('paymentAmount');
          router.push('/payment/orderSuccess');
        } else {
          console.error('Failed to create order:', orderData.message);
        }
      } else {
        console.error('Payment failed:', data.error);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  }

  if (paymentAmount === null) {
    return <div>Loading payment details...</div>;
  }

  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dining Dollars Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Confirm payment with Dining Dollars.</p>
          {/* Simulate form fields here */}
          <Button
            onClick={handlePaymentSuccess}
            variant="default"
            className="w-full py-4 text-lg font-semibold"
          >
            Confirm Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
