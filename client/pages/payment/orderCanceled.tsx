import * as React from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderCanceled() {
  const router = useRouter()

  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Order Canceled</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your order has been canceled successfully.</p>
          <Button
            onClick={() => router.push("/")}
            variant="default"
            className="w-full mt-4"
          >
            Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
