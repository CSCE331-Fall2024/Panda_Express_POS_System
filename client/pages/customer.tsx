import { Button } from "@/components/ui/button";
import { useEffect } from 'react';
import { useTheme } from "@/components/context/theme_context";
import Chatbot from "@/components/ui/chatbot";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers"
import { Home, ShoppingBag, Sun, Moon, Cloud, CloudMoon, CloudRain, CloudSnow } from "lucide-react";
import { useRouter } from "next/router";
import * as React from "react";

interface MenuItem {
  menu_item_id: number;
  price: number;
  item_type: string;
  name: string;
  image: string;
  description: string;
}

interface MenuItems {
  [key: string]: MenuItem[];
}

const weatherIcons = {
  clearDay: <Sun className="h-6 w-6" />,
  clearNight: <Moon className="h-6 w-6" />,
  cloudsDay: <Cloud className="h-6 w-6" />,
  cloudsNight: <CloudMoon className="h-6 w-6" />,
  rain: <CloudRain className="h-6 w-6" />,
  snow: <CloudSnow className="h-6 w-6" />,
};

const CustomerKiosk: React.FC = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = React.useState<MenuItems>({});
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedSides, setSelectedSides] = React.useState<number>(0);
  const [currentItemType, setCurrentItemType] = React.useState<string | null>(null);
  const [selectedEntrees, setSelectedEntrees] = React.useState<number>(0);
  const [order, setOrder] = React.useState<MenuItem[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Combos");
  const [mode, setMode] = React.useState<string>("Customer Self-Service");
  const [weather, setWeather] = React.useState<{ temperature?: number; description?: string; isDay?: boolean } | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "night");
  }, [theme]);

  const categoryOrder = ["Combos", "Side", "Entree", "Appetizer", "Drink"];

  useEffect(() => {
    console.log('Loading from sessionStorage', {
      order: sessionStorage.getItem('order'),
    });
    const storedOrder = sessionStorage.getItem('order');
    const storedTotal = sessionStorage.getItem('total');
    const storedSelectedSides = sessionStorage.getItem('selectedSides');
    const storedSelectedEntrees = sessionStorage.getItem('selectedEntrees');
    const storedCurrentItemType = sessionStorage.getItem('currentItemType');

    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }

    if (storedTotal) {
      setTotal(parseFloat(storedTotal));
    }

    if (storedSelectedSides) {
      setSelectedSides(parseInt(storedSelectedSides));
    }

    if (storedSelectedEntrees) {
      setSelectedEntrees(parseInt(storedSelectedEntrees));
    }

    if (storedCurrentItemType) {
      setCurrentItemType(storedCurrentItemType || null);
    }
  }, []);

  useEffect(() => {
    console.log('Saving to sessionStorage:', {
      order,
      total,
      selectedSides,
      selectedEntrees,
      currentItemType,
    });

    sessionStorage.setItem('order', JSON.stringify(order));
    sessionStorage.setItem('total', total.toString());
    sessionStorage.setItem('selectedSides', selectedSides.toString());
    sessionStorage.setItem('selectedEntrees', selectedEntrees.toString());
    sessionStorage.setItem('currentItemType', currentItemType || '');

    // Store menu item IDs
    const menuItemIds = order.map(item => item.menu_item_id);
    sessionStorage.setItem('menuItemIds', JSON.stringify(menuItemIds));
  }, [order, total, selectedSides, selectedEntrees, currentItemType]);


  useEffect(() => {
    fetch('/api/menu_items')
      .then(response => response.json())
      .then(data => {
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
          setLoading(false);
        } else {
          console.error('Failed to fetch menu items');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
        setLoading(false);
      });
  }, []);
  
  

  const addToOrder = (item: MenuItem, category: string): void => {
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
      }
    }
    if (currentItemType === "Plate") {
      if (category === 'Side' && selectedSides >= 1) return;
      if (category === 'Entree' && selectedEntrees >= 2) return;
    } else if (currentItemType === "Bigger Plate") {
      if (category === 'Side' && selectedSides >= 1) return;
      if (category === 'Entree' && selectedEntrees >= 3) return;
    } else if (currentItemType === "Bowl") {
      if (category === 'Side' && selectedSides >= 1) return;
      if (category === 'Entree' && selectedEntrees >= 1) return;
    }

    setOrder([...order, item]);
    setTotal(total + item.price);

    if (category === 'Side') setSelectedSides(selectedSides + 1);
    if (category === 'Entree') setSelectedEntrees(selectedEntrees + 1);
  };

  const removeFromOrder = (index: number): void => {
    const item = order[index];
    const itemPrice = item.price;
    const newOrder = order.filter((_, i) => i !== index);


    // Adjust counters based on the item category
    if (selectedCategory === 'Side') {

      setSelectedSides(Math.max(0, selectedSides - 1));
    } else if (selectedCategory === 'Entree') {
      setSelectedEntrees(Math.max(0, selectedEntrees - 1));
    }

    if (["Plate", "Bowl", "Bigger Plate"].includes(item.name)) {
      setCurrentItemType(null);
      setSelectedSides(0);
      setSelectedEntrees(0);
    }

    setOrder(newOrder);
    setTotal(total - itemPrice);
  };

  const clearOrder = () => {
    setOrder([]);
    setTotal(0);
    setSelectedSides(0);
    setSelectedEntrees(0);
  };

  const handleCheckout = () => {
    sessionStorage.setItem('paymentAmount', parseFloat((total * 1.0825).toFixed(2)).toString());
    sessionStorage.setItem('order', JSON.stringify(order));
    sessionStorage.setItem('menuItemIds', JSON.stringify(order.map(item => item.menu_item_id)));
    // console.log('menuItemIds', sessionStorage.getItem('menuItemIds'));
    sessionStorage.setItem('staff_id', '0');
    router.push('/orderType'); 
  };

  const handleModeChange = (newMode: string): void => {
    setMode(newMode);
    if (newMode === "Cashier") {
      router.push("/cashier");
    } else if (newMode === "Manager") {
      router.push("/manager");
    }
  };

  // Get weather data based on the location
  React.useEffect(() => {
    const fetchWeatherForLocation = async () => {
      try {
        const location = await getUserLocation();
        if (location) {
          const weatherData = await getWeatherData(location.latitude, location.longitude);
          setWeather(weatherData);
        } else {
          console.log("Location access denied or unavailable.");
        }
      } catch (error) {
        console.error("Error fetching weather or location:", error);
      }
    };

    fetchWeatherForLocation();
  }, []);

  const getWeatherIcon = () => {
    if (!weather?.description || weather.isDay === undefined) return null;
  
    const description = weather.description.toLowerCase();
  
    if (description.includes("clear")) {
      return weather.isDay ? weatherIcons.clearDay : weatherIcons.clearNight;
    }
    if (description.includes("cloud")) {
      return weather.isDay ? weatherIcons.cloudsDay : weatherIcons.cloudsNight;
    }
    if (description.includes("rain")) {
      return weatherIcons.rain;
    }
    if (description.includes("snow")) {
      return weatherIcons.snow;
    }
  
    return <Cloud className="h-6 w-6" />; // Default icon
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span>Loading menu items...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'night' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Navbar */}
      <nav
        className={`p-4 flex items-center justify-between ${
          theme === 'night' ? 'bg-red-800 text-white' : 'bg-red-600 text-white'
        }`}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className={`${
              theme === 'night' ? 'text-white hover:bg-red-900' : 'text-white hover:bg-red-700'
            }`}
          >
            <Home className="h-6 w-6" />
          </Button>
          <img
            src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
            alt="Panda Express Logo"
            className="h-8"
          />
        </div>
  
        <h1 className="text-xl font-bold">{mode}</h1>
  
        <div className="flex items-center gap-4">
          {weather && (
            <div className="flex items-center gap-2">
              {getWeatherIcon()} {/* Weather icon */}
              <span>
                {weather.temperature !== undefined ? `${Math.round(weather.temperature)}°F` : "N/A"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="font-bold">{order.length} items</span>
          </div>
        </div>
      </nav>
  
      {/* Main Content */}
      <div className="container mx-auto p-6 flex gap-6">
        {/* Menu Section */}
        <div className="flex-1">
          <div className="flex gap-4 mb-6">
            {categoryOrder.map((category) => (
              menuItems[category] && (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`${
                    theme === 'night' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                  }`}
                >
                  {category}
                </Button>
              )
            ))}
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            {menuItems[selectedCategory]?.map((item) => (
              <Card
                key={item.name}
                className={`overflow-hidden ${
                  theme === 'night' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                }`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <span className="font-bold">${item.price.toFixed(2)}</span>
                  <Button
                    onClick={() => addToOrder(item, selectedCategory)}
                    className={`${
                      theme === 'night'
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-900'
                    }`}
                  >
                    Add to Order
                  </Button>
                </CardFooter>
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
            <CardTitle>Your Order</CardTitle>
            <CardDescription>Review and customize your meal</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
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
            <Button
              className={`w-full mt-4 ${
                theme === 'night' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
              }`}
              disabled={order.length === 0}
            >
              Checkout ({order.length} items)
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Chatbot/>
    </div>
  );

};

export default CustomerKiosk;