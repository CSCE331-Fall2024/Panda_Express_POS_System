import * as React from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreditCardPayment() {
  const router = useRouter()

  const handlePaymentSuccess = () => {
    console.log("Payment processed successfully via Credit Card.")
    router.push("/payment/orderSuccess")
  }

  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Credit Card Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Enter your credit card information.</p>
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
