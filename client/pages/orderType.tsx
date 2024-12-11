/**
 * OrderTypeSelection Component Documentation
 *
 * This React functional component renders a page where users can select the type of order they wish to place ("Here" or "To Go").
 * It includes functionality for canceling the order and provides a base for additional features, such as editing an existing order.
 */

import * as React from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * OrderTypeSelection Component
 *
 * This component allows users to choose their order type or cancel the order. It is styled with Card components for structure and
 * buttons for interaction.
 */
export default function OrderTypeSelection() {
  const router = useRouter();

  /**
   * Redirect to the payment screen with "Here" as the order type.
   */
  const handleHere = () => {
    router.push("/payment?orderType=here");
  };

  /**
   * Redirect to the payment screen with "To Go" as the order type.
   */
  const handleToGo = () => {
    router.push("/payment?orderType=to-go");
  };

  /**
   * Cancel the current order and redirect to a cancellation page.
   */
  const handleCancelOrder = () => {
    console.log("Order canceled.");
    router.push("/payment/orderCanceled");
  };

  

  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md text-center bg-white/75">
        <CardHeader>
          <CardTitle>Order Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Please choose if the order is "Here" or "To Go".</p>

          {/* Button to choose "Here" order type */}
          <Button
            onClick={handleHere}
            variant="default"
            className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
          >
            Here
          </Button>

          {/* Button to choose "To Go" order type */}
          <Button
            onClick={handleToGo}
            variant="default"
            className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
          >
            To Go
          </Button>

          {/* Placeholder for Edit Order functionality */}
          {/* <Button
            onClick={handleEditOrder}
            variant="destructive"
            className="w-full py-3 text-lg font-semibold"
          >
            Edit Order
          </Button> */}

          {/* Button to cancel the order */}
          <Button
            onClick={handleCancelOrder}
            variant="destructive"
            className="w-full py-3 text-lg font-semibold"
          >
            Cancel Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
