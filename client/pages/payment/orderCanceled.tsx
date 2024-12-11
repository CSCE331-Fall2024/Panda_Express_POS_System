/**
 * This component renders a page that informs the user that their order has been canceled.
 * It displays a card with a message and a button to return to the home page.
 *
 * @component
 * @example
 * // To use this component, simply import and include it in your Next.js page
 * import OrderCanceled from 'path/to/OrderCanceled';
 *
 * function MyApp() {
 *   return <OrderCanceled />;
 * }
 *
 * @returns {JSX.Element} The rendered component.
 */
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderCanceled() {
  const router = useRouter()
  return (
    <div className="flex h-screen justify-center items-center bg-background">
      <Card className="w-full max-w-md text-center bg-white/75">
        <CardHeader>
          <CardTitle>Order Canceled</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your order has been canceled successfully.</p>
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
