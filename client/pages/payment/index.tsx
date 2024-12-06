import { useRouter } from "next/router"
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
    console.log(sessionStorage.getItem("staff_id"));
    router.push("/payment/payHereOptions")
  }

  const handlePayAtCounter = () => {
    console.log("Proceeding to pay at counter...")
    if (sessionStorage.getItem("userRole") === "customer") {
      router.push("/payment/payAtCounter")
    }
    else if (sessionStorage.getItem("userRole") === "employee") {
      router.push("/payment/payAtCounter")
    }
  }

  const handleCancelOrder = () => {
    console.log("Order canceled.")
    router.push("/payment/orderCanceled")
  }

  return (
    <div className="flex h-screen bg-background justify-center items-center">
      <main className="flex-1 p-6 space-y-6">
        <header>
        </header>
        <div className="flex justify-center">
          <Card className="w-full max-w-md text-center bg-white/75">
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
                className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
              >
                Pay Here (Credit, Dining Dollars)
              </Button>
              <Button
                onClick={handlePayAtCounter}
                variant="default"
                className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
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
