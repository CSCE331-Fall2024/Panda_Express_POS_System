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

  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Order Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Please choose if the order is "Here" or "To Go".</p>
          <Button
            onClick={handleHere}
            variant="default"
            className="w-full py-4 text-lg font-semibold"
          >
            Here
          </Button>
          <Button
            onClick={handleToGo}
            variant="default"
            className="w-full py-4 text-lg font-semibold"
          >
            To Go
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
