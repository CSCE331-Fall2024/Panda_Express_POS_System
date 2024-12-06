import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PayHereOptions() {
  const router = useRouter()

  const handleCreditCardPayment = () => {
    router.push("/payment/creditCardPayment")
  }

  const handleDiningDollarsPayment = () => {
    router.push("/payment/diningDollarsPayment")
  }

  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md text-center bg-white/75">
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleCreditCardPayment}
            variant="default"
            className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
          >
            Credit Card
          </Button>
          <Button
            onClick={handleDiningDollarsPayment}
            variant="default"
            className="w-full py-4 text-lg font-semibold bg-black text-white hover:bg-gray-900"
          >
            Dining Dollars
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
