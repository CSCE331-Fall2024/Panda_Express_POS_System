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
  const { user, isManager, isCashier } = useUser();
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
    if (!(isManager() || isCashier())) {
      router.push('/login');
    }
  }, [user, router, isManager, isCashier]);

  if (!(isManager() || isCashier()) ) return null;

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundColor: "var(--background-color)",
        color: "var(--cashier-text-color)",
      }}
    >
      <SidebarMenu/>

      <main className="flex-1 p-6 space-y-6">
        <Header mode=""/>

        <div className="flex gap-4">
          {/* Menu Section */}
          <div
            className="flex-1"
            style={{
              backgroundColor: "var(--menu-section-box)", // Darker box for menu
              padding: "16px", // Adjust padding to reduce size
              border: "1px solid var(--border-style)", // Light gray border
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              maxHeight: "70vh", // Limit box height
              overflowY: "auto", // Add scroll if content overflows
            }}
          >
            <MenuDisplay menuItems={menuItems} onAddToOrder={addToOrder} />
          </div>

          {/* Order Summary Section */}
          <div
            style={{
              width: "25%", // Reduce width to make boxes fit better
              backgroundColor: "var(--menu-section-box)", // Darker box for order summary
              padding: "16px", // Adjust padding to reduce size
              border: "1px solid var(--border-style)", // Light gray border
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              maxHeight: "70vh", // Limit box height
              overflowY: "auto", // Add scroll if content overflows
            }}
          >
            <OrderSummary
              order={order}
              total={total}
              onRemoveFromOrder={removeFromOrder}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
