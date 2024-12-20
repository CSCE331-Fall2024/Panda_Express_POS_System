/**
 * DiningDollarsPayment component handles the payment process using Dining Dollars.
 * It retrieves payment details from session storage, processes the payment, creates an order,
 * and associates menu items with the order.
 *
 * @remarks
 * This component handles the payment process using Dining Dollars.
 * It retrieves payment details from session storage, processes the payment, creates an order,
 * and associates menu items with the order.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage example:
 * <DiningDollarsPayment />
 *
 *
 * 
 */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";

/**
 * DiningDollarsPayment Functional Component
 * Renders the dining dollars payment page where users can confirm their payment.
 *
 * @returns {JSX.Element} The rendered DiningDollarsPayment component.
 */
export default function DiningDollarsPayment() {
  const router = useRouter();
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [staffId, setStaffId] = useState<number | null>(null);
  const [menuItemIds, setMenuItemIds] = useState<number[] | null>(null);

  useEffect(() => {
    const total = sessionStorage.getItem("paymentAmount");
    // const total = "100";

    if (total) {
      setPaymentAmount(parseFloat(total));
    } else {
      router.push("/customer");
    }

    const staffId = sessionStorage.getItem("staff_id")
      ? parseInt(sessionStorage.getItem("staff_id") as string)
      : 0;
    setStaffId(staffId);

    const menuItemIds = sessionStorage.getItem("menuItemIds");
    if (menuItemIds) {
      setMenuItemIds(JSON.parse(menuItemIds));
    } else {
      router.push("/customer");
      console.error("No menu item IDs found in session storage.");
    }
  }, [router]);

  /**
   * Function to handle the payment success.
   * It processes the payment, creates an order, and associates menu items with the order.
   * If successful, it redirects the user to the order success page.
   * If an error occurs, it logs the error to the console.
   */
  const handlePaymentSuccess = async () => {
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentType: "TAMU_ID",
          paymentAmount: paymentAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Payment processed successfully via Dining Dollars.");
        // sessionStorage.removeItem('paymentAmount');

        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total: paymentAmount,
            staffId: staffId,
            paymentId: data.paymentId,
          }),
        });

        const orderData = await orderResponse.json();

        if (orderData.success && menuItemIds) {
          console.log("Order created successfully with ID:", orderData.orderId);

          const jointResponse = await fetch("/api/menu_order_jt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderData.orderId,
              menuItemIds: menuItemIds,
            }),
          });

          const jointData = await jointResponse.json();

          if (jointData.success) {
            console.log("Menu items added to menu_item_order_jt successfully.");
            sessionStorage.removeItem("paymentAmount")
            sessionStorage.removeItem("menuItemIds")
            sessionStorage.removeItem("order")
            sessionStorage.removeItem("total")
            sessionStorage.removeItem("selectedSides")
            sessionStorage.removeItem("selectedEntrees")
            sessionStorage.removeItem("currentItemType")
            sessionStorage.removeItem("carteSelected")
            if (sessionStorage.getItem("userRole") === "customer") {
              router.push("/payment/orderSuccess");
            } else if (sessionStorage.getItem("userRole") === "employee") {
              router.push("/cashier");
            }
          } else {
            console.error(
              "Failed to add menu items to menu_item_order_jt:",
              jointData.message
            );
          }
        } else {
          console.error("Failed to create order:", orderData.message);
        }
      } else {
        console.error("Payment failed:", data.error);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  if (paymentAmount === null) {
    return <div>Loading payment details...</div>;
  }

  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md text-center bg-white/75">
        <CardHeader>
          <CardTitle>Dining Dollars Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <p>Enter your dining dollars information.</p>
          Simulate form fields here */}
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
  );
}
