/**
 * Represents an order summary component.
 * 
 * @remarks
 * This component provides a summary of the order with customizable styles.
 * 
 * @returns {JSX.Element} The rendered order summary component.
 */
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  order: string[];
  total: number;
  onRemoveFromOrder: (index: number) => void;
  onCheckout: () => void;
}

const OrderSummary: FC<OrderSummaryProps> = ({ order, total, onRemoveFromOrder, onCheckout }) => (
  <Card
    className="w-80"
    style={{
      boxShadow: "none",
      border: "none",
      height: "100%", // Ensure height fits container
    }}
  >
    <CardHeader style={{ padding: "0.5rem" }}>
      <CardTitle>Your Order</CardTitle>
      <CardDescription>Review and customize your meal</CardDescription>
    </CardHeader>
    <CardContent
      style={{
        padding: "0.5rem",
        overflow: "hidden", // No scrolling
      }}
    >
      {order.map((item, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <span>{item}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFromOrder(index)}
            style={{
              color: "var(--cashier-text-color)", // Ensures consistent styling
            }}
          >
            X
          </Button>
        </div>
      ))}
    </CardContent>
    <Separator />
    <CardFooter
      className="flex flex-col items-start"
      style={{
        padding: "0.5rem",
        gap: "0.5rem",
        overflow: "hidden", // No scrolling
      }}
    >
      <div className="flex justify-between w-full">
        <span>Subtotal:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between w-full">
        <span>Tax:</span>
        <span>${(total * 0.0825).toFixed(2)}</span>
      </div>
      <div className="flex justify-between w-full font-bold">
        <span>Total:</span>
        <span>${(total * 1.0825).toFixed(2)}</span>
      </div>
      <Button
        className="w-full mt-4"
        disabled={order.length === 0}
        onClick={onCheckout}
        style={{
          border: "1px solid var(--border-style)",
          color: "var(--cashier-text-color)",
        }}
      >
        Checkout
      </Button>
    </CardFooter>
  </Card>
);

export default OrderSummary;
