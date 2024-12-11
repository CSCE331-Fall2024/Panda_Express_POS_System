/**
 * @file creditCardPayment.tsx
 * @description This file contains the CreditCardPayment component which handles the credit card payment process.
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * CreditCardPayment component handles the credit card payment process.
 * It retrieves payment details from session storage, processes the payment,
 * creates an order, and associates menu items with the order.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
export default function CreditCardPayment() {
  const router = useRouter()
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [staffId, setStaffId] = useState<number | null>(null);
  const [menuItemIds, setMenuItemIds] = useState<number[] | null>(null);

  /**
   * useEffect hook to retrieve payment details from session storage and set state variables.
   * Redirects to the customer page if payment details are not found.
   */
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

  /**
   * Handles the payment success process.
   * Sends payment details to the server, creates an order, and associates menu items with the order.
   * Redirects to the appropriate success page based on user role.
   */
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
            sessionStorage.removeItem("order")
            sessionStorage.removeItem("total")
            sessionStorage.removeItem("selectedSides")
            sessionStorage.removeItem("selectedEntrees")
            sessionStorage.removeItem("currentItemType")
            sessionStorage.removeItem("carteSelected")
            if (sessionStorage.getItem("userRole") === "customer") {
              router.push("/payment/orderSuccess")
            }
            else if (sessionStorage.getItem("userRole") === "employee") {
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
          <CardTitle>Credit Card Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handlePaymentSuccess}
            variant="default"
            className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
          >
            Confirm Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
