import * as React from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderTypeSelection() {
  const router = useRouter()

  const handleHere = () => {
    // Redirect to the payment screen with "Here" as the order type
    router.push("/payment?orderType=here")
  }

  const handleToGo = () => {
    // Redirect to the payment screen with "To Go" as the order type
    router.push("/payment?orderType=to-go")
  }
  
  const handleCancelOrder = () => {
    console.log("Order canceled.")
    router.push("/payment/orderCanceled")
  }

//attempting to add edit order button
//   const handleEditOrder = () => {
//     const storedOrder = sessionStorage.getItem("order");
//     alert(storedOrder);

//     if (storedOrder) {
//         const parsedOrder = JSON.parse(storedOrder);
//         console.log("Editing order with details:", parsedOrder);
//         alert(JSON.stringify(parsedOrder));

//         if (!parsedOrder.userRole) {
            
//             console.log("Redirecting to customer page.");
//             // Redirect to the customer page
//             router.push({
//                 pathname: "/customer",
//                 query: { edit: true, orderDetails: JSON.stringify(parsedOrder) },
//             });
//         } else {
//             console.log("Redirecting to cashier page.");
//             // Redirect to the cashier page
//             router.push({
//                 pathname: "/cashier",
//                 query: { edit: true, orderDetails: JSON.stringify(parsedOrder) },
//             });
//         }
//     } else {
//         console.log("No stored order found.");

//         // Optionally, clear any old orders if needed
//         sessionStorage.removeItem("orderDetails");

//         // Redirect to the kiosk page for a new order
//         router.push("/customer");
//     }
// };


  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md text-center bg-white/75">
        <CardHeader>
          <CardTitle>Order Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Please choose if the order is "Here" or "To Go".</p>
          <Button
            onClick={handleHere}
            variant="default"
            className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
          >
            Here
          </Button>
          <Button
            onClick={handleToGo}
            variant="default"
            className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
          >
            To Go
          </Button>
          {/* attempt to add edit order button */}
          {/* <Button
                onClick={handleEditOrder}
                variant="destructive"
                className="w-full py-3 text-lg font-semibold"
              >
                Edit Order
              </Button> */}
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
  )
}
