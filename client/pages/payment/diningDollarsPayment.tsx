import * as React from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DiningDollarsPayment() {
  const router = useRouter()

  const handlePaymentSuccess = () => {
    console.log("Payment processed successfully via Dining Dollars.")
    router.push("/payment/orderSuccess")
  }

  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dining Dollars Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Confirm payment with Dining Dollars.</p>
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
