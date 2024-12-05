import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/router';
import { useUser } from '@/components/ui/user_context';
import { Home, ShoppingCart, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/context/theme_context";

interface MenuItem {
  menu_item_id: number;
  price: number;
  item_type: string;
  name: string;
  description: string;
  special: boolean;
  image: string;
}

interface MenuItems {
  [key: string]: MenuItem[];
}

const CashierPOS: React.FC = () => {
  const router = useRouter();
  const { user, isManager, isCashier } = useUser();
  const { theme } = useTheme();

  // State management
  const [menuItems, setMenuItems] = useState<MenuItems>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Combos");
  const [order, setOrder] = useState<MenuItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentItemType, setCurrentItemType] = useState<string | null>(null);
  const [selectedSides, setSelectedSides] = useState<number>(0);
  const [selectedEntrees, setSelectedEntrees] = useState<number>(0);
  const [carteSelected, setCarteSelected] = useState<string | null>(null);

  // Category order and translations
  const categoryTranslations = {
    "Combos": "Combos",
    "Side": "Sides",
    "Entree": "Entrees", 
    "Appetizer": "Appetizers",
    "Drink": "Drinks"
  };

  const categoryOrder = ["Combos", "Side", "Entree", "Appetizer", "Drink"];

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu_items');
        const data = await response.json();
        if (data.success) {
          const itemsByCategory = data.menuItems.reduce((acc: MenuItems, item: MenuItem) => {
            const category = item.item_type;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(item);
            return acc;
          }, {});
          setMenuItems(itemsByCategory);
        } else {
          console.error('Failed to fetch menu items');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Save sessionStorage whenever relevant states change
  useEffect(() => {
    console.log('Saving to sessionStorage:', {
      order,
      total,
      selectedSides,
      selectedEntrees,
      currentItemType,
      carteSelected,
    });

    sessionStorage.setItem('order', JSON.stringify(order));
    sessionStorage.setItem('total', total.toString());
    sessionStorage.setItem('selectedSides', selectedSides.toString());
    sessionStorage.setItem('selectedEntrees', selectedEntrees.toString());
    sessionStorage.setItem('currentItemType', currentItemType || '');
    sessionStorage.setItem('carteSelected', carteSelected || '');
    sessionStorage.setItem('userRole', 'employee');

    // Store menu item IDs
    const menuItemIds = order.map(item => item.menu_item_id);
    sessionStorage.setItem('menuItemIds', JSON.stringify(menuItemIds));
  }, [order, total, selectedSides, selectedEntrees, currentItemType, carteSelected]);

  // Authentication check
  useEffect(() => {
    if (!(isManager() || isCashier())) {
      router.push('/login');
    }
  }, [user, router, isManager, isCashier]);


  

  // Order management functions
  const addToOrder = (item: MenuItem, category: string): void => {
    // Logic for handling combo selections
    if (category === 'Combos') {
      if (item.name === "Plate") {
        setCurrentItemType("Plate");
        setSelectedSides(0);
        setSelectedEntrees(0);
      } else if (item.name === "Bigger Plate") {
        setCurrentItemType("Bigger Plate");
        setSelectedSides(0);
        setSelectedEntrees(0);
      } else if (item.name === "Bowl") {
        setCurrentItemType("Bowl");
        setSelectedSides(0);
        setSelectedEntrees(0);
      } else if (item.name === "A La Carte") {
        setCurrentItemType("A La Carte");
        setCarteSelected(null);
        setSelectedSides(0);
        setSelectedEntrees(0);
      }
      setSelectedCategory("Side")
    }

    // Enforce selection limits based on current combo type
    if (currentItemType === "Plate") {
      if (category === 'Side' && selectedSides >= 1) return;
      if (category === 'Entree' && selectedEntrees >= 2) return;
    } else if (currentItemType === "Bigger Plate") {
      if (category === 'Side' && selectedSides >= 1) return;
      if (category === 'Entree' && selectedEntrees >= 3) return;
    } else if (currentItemType === "Bowl") {
      if (category === 'Side' && selectedSides >= 1) return;
      if (category === 'Entree' && selectedEntrees >= 1) return;
    } else if (currentItemType === "A La Carte") {
      if ((category === 'Side' || category === 'Entree') && (selectedSides >= 1 || selectedEntrees >= 1)) return;
      if (carteSelected === 'Side' || carteSelected === 'Entree') return;
    }

    // Add item to order
    setOrder([...order, item]);
    if(category === 'Combos' && item.name !== "A La Carte") {
      setTotal(total + item.price);
    } else if (category === 'Appetizer' || category === 'Drink') {
      setTotal(total + item.price);
    }

    if (currentItemType === "A La Carte") {
      if(item.name !== "A La Carte") {
        setTotal(total + item.price);
      }

      if (category === 'Side') {
        setCarteSelected("Side");
      } else if (category === 'Entree') {
        setCarteSelected("Entree");
      }
    }

    if (currentItemType !== "A La Carte") {
      if(item.special) {
        setTotal(total + 1.5);
      }
    }

    if (category === 'Side') {
      setSelectedSides(selectedSides + 1);
      if (currentItemType === "Plate" && selectedSides + 1 === 1) {
        setSelectedCategory("Entree");
      } else if (currentItemType === "Bigger Plate" && selectedSides + 1 === 1) {
        setSelectedCategory("Entree");
      } else if (currentItemType === "Bowl" && selectedSides + 1 === 1) {
        setSelectedCategory("Entree");
      }
    }
  
    if (category === 'Entree') {
      setSelectedEntrees(selectedEntrees + 1);
      if (
        (currentItemType === "Plate" && selectedEntrees + 1 === 2) ||
        (currentItemType === "Bigger Plate" && selectedEntrees + 1 === 3) ||
        (currentItemType === "Bowl" && selectedEntrees + 1 === 1)
      ) {
        setSelectedCategory("Appetizer");
      }
    }
  };

  const removeFromOrder = (index: number): void => {
    const item = order[index];
    const newOrder = [...order];
    newOrder.splice(index, 1);

    if (selectedCategory === 'Side') {
      setSelectedSides(Math.max(0, selectedSides - 1));
      if(carteSelected === "Side") {
        setCarteSelected(null);
      }
    } else if (selectedCategory === 'Entree') {
      setSelectedEntrees(Math.max(0, selectedEntrees - 1));
      if(carteSelected === "Entree") {
        setCarteSelected(null);
      }
    }
  
    if (["Plate", "Bowl", "Bigger Plate"].includes(item.name)) {
      setTotal((prevTotal) => Math.max(0, prevTotal - item.price));
      let sidesToRemove = 0;
      let entreesToRemove = 0;
  
      // Determine how many sides and entrees to treat as a la carte based on combo type
      if(selectedSides > 0 || selectedEntrees > 0) {
        if (item.name === "Plate" || item.name === "Bowl" || item.name === "Bigger Plate") {
          sidesToRemove = selectedSides;
          entreesToRemove = selectedEntrees;
        } 
      } else {
        if (item.name === "Plate"){
          sidesToRemove = 1;
          entreesToRemove = 2;
        } else if (item.name === "Bigger Plate"){
          sidesToRemove = 1;
          entreesToRemove = 3;
        } else if (item.name === "Bowl"){
          sidesToRemove = 1;
          entreesToRemove = 1;
        }
      }
  
      const itemsToRemove = [];
  
      // Traverse the order backward to find the last items matching sides/entrees
      for (let i = newOrder.length - 1; i >= 0; i--) {
        const currentItem = newOrder[i];
  
        if (sidesToRemove > 0 && currentItem.item_type === "Side") {
          sidesToRemove--;
          itemsToRemove.push(i);
        } else if (entreesToRemove > 0 && currentItem.item_type === "Entree") {
          entreesToRemove--;
          itemsToRemove.push(i);
        }
  
        // Break early if all sides and entrees are accounted for
        if (sidesToRemove === 0 && entreesToRemove === 0) {
          break;
        }
      }

      const specialItemsCount = itemsToRemove.reduce(
        (count, i) => (newOrder[i].special ? count + 1 : count),
        0
      );
  
      setTotal((prevTotal) => Math.max(0, prevTotal - specialItemsCount * 1.5));
  
      // Remove the identified items from the order
      itemsToRemove.sort((a, b) => b - a).forEach((i) => newOrder.splice(i, 1));
  
      // Update the total and state
      setCurrentItemType(null);
      setSelectedSides(0);
      setSelectedEntrees(0);
    } else if (currentItemType === "A La Carte") {
      let sidesToRemove = 0;
      let entreesToRemove = 0;

      // Determine how many sides or entrees to remove
      if (carteSelected === "Side") {
        sidesToRemove = 1;
      } else if (carteSelected === "Entree") {
        entreesToRemove = 1;
      }

      const itemsToRemove = [];

      // Traverse the order backward to find the last items matching sides/entrees
      for (let i = newOrder.length - 1; i >= 0; i--) {
        const currentItem = newOrder[i];

        if (sidesToRemove > 0 && currentItem.item_type === "Side") {
          sidesToRemove--;
          itemsToRemove.push(i);
        } else if (entreesToRemove > 0 && currentItem.item_type === "Entree") {
          entreesToRemove--;
          itemsToRemove.push(i);
        }

        // Break early if all sides and entrees are accounted for
        if (sidesToRemove === 0 && entreesToRemove === 0) {
          break;
        }
      }

      // Remove the identified items from the order
      itemsToRemove.sort((a, b) => b - a).forEach((i) => {
        const removedItem = newOrder.splice(i, 1)[0];
        if (removedItem.name !== "A La Carte" ) {
          setTotal((prevTotal) => Math.max(0, prevTotal - removedItem.price));
        } 
      });

      // Update counts and reset carteSelected
      if (carteSelected === "Side") {
        setSelectedSides(Math.max(0, selectedSides - 1));
      } else if (carteSelected === "Entree") {
        setSelectedEntrees(Math.max(0, selectedEntrees - 1));
      }

      setCarteSelected(null);
    } else {
      // If it's a regular item, no change to the total
      if (item.special) {
        setTotal((prevTotal) => Math.max(0, prevTotal - 1.5));
      }
    }

    if (item.item_type === "Appetizer" || item.item_type === "Drink") {
      setTotal((prevTotal) => Math.max(0, prevTotal - item.price));
    }
  
    setOrder(newOrder);

    console.log(selectedCategory);
    console.log(selectedSides);
    console.log(selectedEntrees);
  };
  const clearOrder = () => {
    setOrder([]);
    setTotal(0);
    setSelectedSides(0);
    setSelectedEntrees(0);
    setCurrentItemType(null);
    setCarteSelected(null);
  };

  const handleCheckout = () => {
    sessionStorage.setItem('paymentAmount', parseFloat((total * 1.0825).toFixed(2)).toString());
    sessionStorage.setItem('order', JSON.stringify(order));
    // sessionStorage.setItem('staff_id', user?.id?.toString() || '0');
    // console.log('User ID:', user?.id);
    router.push('/orderType');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span>Loading menu items...</span>
      </div>
    );
  }

  if (!(isManager() || isCashier())) return null;

  return (
    <div className={`min-h-screen ${theme === 'night' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Navbar */}
      <nav 
        className={`p-4 flex items-center justify-between ${
          theme === 'night' ? 'bg-red-900 text-white' : 'bg-red-600 text-white'
        }`}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className={`${
              theme === 'night' ? 'text-white hover:bg-red-800' : 'text-white hover:bg-red-700'
            }`}
          >
            <Home className="h-6 w-6" />
          </Button>
          <span className="text-xl font-bold">Cashier Point of Sale</span>
        </div>
        
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          <span className="font-bold">{order.length} items</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6 flex gap-6">
        {/* Menu Section */}
        <div className="flex-1">
          {/* Category Buttons */}
          <div className="flex gap-4 mb-6">
            {categoryOrder.map((category) => (
              menuItems[category] && (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`${
                    selectedCategory === category 
                      ? theme === 'night' 
                        ? 'bg-gray-700 text-white border-gray-600' 
                        : 'bg-gray-200 text-black border-gray-300 hover:bg-gray-200'
                      : theme === 'night'
                        ? 'bg-gray-900 text-white border-gray-700 hover:bg-gray-700'
                        : 'bg-white text-black border-gray-300 hover:bg-gray-200' 
                  }`}
                >
                  <span className="font-bold" style={{fontSize: '1rem'}}>
                    {categoryTranslations[category as keyof typeof categoryTranslations]}
                  </span>
                </Button>
              )
            ))}
          </div>

          {/* Menu Items - Simplified grid */}
          <div className="grid grid-cols-3 gap-4">
            {menuItems[selectedCategory]?.map((item) => (
              <Card
                key={item.menu_item_id}
                className={`overflow-hidden ${
                  theme === 'night' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  {/* <CardDescription>{item.description}</CardDescription> */}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                    <Button
                      onClick={() => addToOrder(item, selectedCategory)}
                      className={`${
                        theme === 'night'
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-900'
                      }`}
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <Card
          className={`w-96 ${
            theme === 'night' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-black border-gray-300'
          }`}
        >
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Current Transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[339px]">
              {order.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center mb-2 p-2 ${
                    theme === 'night' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
                  } rounded`}
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromOrder(index)}
                    className={`${
                      theme === 'night' ? 'text-white hover:text-red-500' : 'text-black hover:text-red-500'
                    }`}
                  >
                    Remove
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
            <div className="flex w-full gap-2 mt-4">
              <Button
                className={`flex-1 ${
                  theme === 'night' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
                }`}
                disabled={order.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={order.length === 0}
                onClick={clearOrder}
              >
                Clear Order
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CashierPOS;