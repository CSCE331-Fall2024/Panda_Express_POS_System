import * as React from "react"
import { useRouter } from "next/router"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function PaymentScreen() {
  const router = useRouter()

  const handlePayHere = () => {
    console.log("Processing payment via Pay Here method...")
    router.push("/orderSuccess")
  }

  const handlePayAtCounter = () => {
    console.log("Proceeding to pay at counter...")
    router.push("/orderSuccess")
  }

  const handleCancelOrder = () => {
    console.log("Order canceled.")
    router.push("/orderCanceled")
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-16 bg-muted flex flex-col items-center py-4 space-y-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <Home className="h-6 w-6" />
        </Button>
      </aside>
      <main className="flex-1 p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-primary">Payment</h1>
          <p className="text-muted-foreground">
            Select your payment method
          </p>
        </header>
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
              <CardDescription>
                Please choose your preferred method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handlePayHere}
                variant="default"
                className="w-full py-4 text-lg font-semibold"
              >
                Pay Here (Credit, Dining Dollars)
              </Button>
              <Button
                onClick={handlePayAtCounter}
                variant="default"
                className="w-full py-4 text-lg font-semibold"
              >
                Pay at Counter
              </Button>
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
      </main>
    </div>
  )
}
