/**
 * This component handles the payment process at the counter.
 * It retrieves payment details from session storage and allows the user to choose a payment method.
 * Upon successful payment, it creates an order and associates menu items with the order.
 * 
 * @remarks
 * This component handles the payment process at the counter.
 * It retrieves payment details from session storage and allows the user to choose a payment method.
 * Upon successful payment, it creates an order and associates menu items with the order.
 * 
 * @example
 * // Usage
 * <PayAtCounter />
 * 
 * @remarks
 * This component uses the Next.js `useRouter` hook for navigation and the `useState` and `useEffect` hooks for state management.
 * It also uses custom `Button` and `Card` components for UI.
 * 
 * @function
 * @name PayAtCounter
 * 
 * @typedef {Object} PaymentResponse
 * @property {boolean} success - Indicates if the payment was successful.
 * @property {string} paymentId - The ID of the processed payment.
 * 
 * @typedef {Object} OrderResponse
 * @property {boolean} success - Indicates if the order creation was successful.
 * @property {string} orderId - The ID of the created order.
 * 
 * @typedef {Object} JointResponse
 * @property {boolean} success - Indicates if the menu items were successfully added to the order.
 * 
 * @hook
 * @name useEffect
 * @description Retrieves payment details from session storage and sets the state accordingly. Redirects to the customer page if details are missing.
 * 
 * @hook
 * @name useState
 * @description Manages the state for payment amount, staff ID, and menu item IDs.
 * 
 * @param {string} paymentType - The type of payment selected by the user.
 * @returns {Promise<void>} Handles the payment success process, including creating an order and associating menu items.
 * 
 * @throws Will throw an error if the payment or order creation fails.
 */
import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"

export default function PayAtCounter() {
  const router = useRouter();
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [staffId, setStaffId] = useState<number | null>(null);
  const [menuItemIds, setMenuItemIds] = useState<number[] | null>(null);
  useEffect(() => {
    const total = sessionStorage.getItem('paymentAmount');
    
    if(total) {
      setPaymentAmount(parseFloat(total));
    } else {
      router.push("/customer");
    }

    const staffId = sessionStorage.getItem('staff_id') ? parseInt(sessionStorage.getItem('staff_id') as string) : 0;
    setStaffId(staffId);

    const menuItemIds = sessionStorage.getItem('menuItemIds');
    if (menuItemIds) {
      setMenuItemIds(JSON.parse(menuItemIds));
    } else {
      router.push("/customer");
      console.error('No menu item IDs found in session storage.');
    }

  }, [router]);

  const handlePaymentSuccess = async (paymentType: string) => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentType,
          paymentAmount: paymentAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Payment processed successfully via Credit Card.');

        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total: paymentAmount,
            staffId: staffId,
            paymentId: data.paymentId,
          }),
        });

        const orderData = await orderResponse.json()

        if (orderData.success && menuItemIds) {
          console.log("Order created successfully with ID:", orderData.orderId)

          const jointResponse = await fetch("/api/menu_order_jt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderData.orderId,
              menuItemIds: menuItemIds,
            }),
          })

          const jointData = await jointResponse.json()

          if (jointData.success) {
            console.log("Menu items added to menu_item_order_jt successfully.")
            sessionStorage.removeItem("paymentAmount")
            sessionStorage.removeItem("menuItemIds")
            if (sessionStorage.getItem("userRole") === "customer") {
              router.push("/payment/orderSuccess")
            }
            else if (sessionStorage.getItem("userRole") === "employee") {
              router.push("/cashier")
            }
            else if (sessionStorage.getItem("userRole") === "manager") {
                router.push("/cashier")
              }
          } else {
            console.error("Failed to add menu items to menu_item_order_jt:", jointData.message)
          }
        } else {
          console.error("Failed to create order:", orderData.message)
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
      <Card className="w-full max-w-md text-center bg-white/75">
        <CardHeader>
          <CardTitle>Choose Payment Method At Counter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() =>handlePaymentSuccess("Credit Card")}
            variant="default"
            className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
          >
            Credit Card
          </Button>
          <Button
            onClick={() =>handlePaymentSuccess("TAMU_ID")}
            variant="default"
            className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
          >
            Dining Dollars
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
