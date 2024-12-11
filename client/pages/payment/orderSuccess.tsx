/**
 * @fileoverview This file contains the `OrderSuccess` component which displays a success message
 * after a successful order payment. It includes a button to navigate back to the home page.
 */

import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * `OrderSuccess` component renders a success message for the user after a successful order payment.
 * It includes a button that redirects the user to the home page.
 *
 * @component
 * @example
 * return (
 *   <OrderSuccess />
 * )
 */
export default function OrderSuccess() {
  const router = useRouter()
  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md text-center bg-white/75">
        <CardHeader>
          <CardTitle>Order Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Thank you for your payment. Your order has been processed successfully.</p>
          <Button
            onClick={() => router.push("/")}
            variant="default"
            className="w-full mt-4 bg-black text-white hover:bg-gray-900"
          >
            Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
