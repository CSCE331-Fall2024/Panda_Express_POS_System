import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderSummaryProps {
  order: string[];
  total: number;
  onRemoveFromOrder: (index: number) => void;
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order, total, onRemoveFromOrder, onCheckout }) => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Your Order</CardTitle>
      <CardDescription>Review and customize your meal</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[300px]">
        {order.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>{item}</span>
            <Button variant="ghost" size="sm" onClick={() => onRemoveFromOrder(index)}>
              X
            </Button>
          </div>
        ))}
      </ScrollArea>
    </CardContent>
    <Separator />
    <CardFooter className="flex flex-col items-start">
      <div className="flex justify-between w-full mb-2">
        <span>Subtotal:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between w-full mb-2">
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
          border: "1px solid var(--border-style)"
        }}
      >
        Checkout
      </Button>
    </CardFooter>
  </Card>
);

export default OrderSummary;
