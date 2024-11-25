import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SidebarMenu from '@/components/ui/sidebar_menu';
import Header from '@/components/ui/header';
import MenuDisplay from '@/components/ui/menu_display';
import OrderSummary from '@/components/ui/order_summary';
import { useUser } from '@/components/ui/user_context';

const menuItems = {
  combos: ["Bowl", "Plate", "Bigger Plate", "Biggest Plate"],
  sides: ["White Rice", "Brown Rice", "Chow Mein", "Fried Rice", "Super Greens"],
  entrees: ["Orange Chicken", "Beijing Beef", "Mushroom Chicken", "Teriyaki Chicken", "Kung Pao Chicken", "Black Pepper Chicken", "Firecracker Shrimp", "Honey Walnut Shrimp", "Beef and Broccoli"],
};

export default function PandaExpressPOS() {
  const router = useRouter();
  const { user } = useUser();
  const [order, setOrder] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  const addToOrder = (item: string) => {
    setOrder([...order, item]);
    setTotal(total + 7.0);
  };

  const removeFromOrder = (index: number) => {
    const newOrder = order.filter((_, i) => i !== index);
    setOrder(newOrder);
    setTotal(total - 7.0);
  };

  const handleCheckout = () => {
    sessionStorage.setItem('paymentAmount', parseFloat((total * 1.0825).toFixed(2)).toString());
    router.push('/orderType');
  };

  useEffect(() => {
    if (user.role !== 'cashier') {
      router.push('/login'); // Redirect unauthorized users to login
    }
  }, [user, router]);

  if (user.role !== 'cashier') return null;

  return (
    <div className="flex h-screen bg-background">
      <SidebarMenu />
      <main className="flex-1 p-6 space-y-6">
        <Header mode="Cashier" />
        <div className="flex gap-6">
          <div className="flex-1">
            <MenuDisplay menuItems={menuItems} onAddToOrder={addToOrder} />
          </div>
          <OrderSummary order={order} total={total} onRemoveFromOrder={removeFromOrder} onCheckout={handleCheckout} />
        </div>
      </main>
    </div>
  );
}
