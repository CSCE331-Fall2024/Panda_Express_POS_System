import { Button } from "@/components/ui/button";
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
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers"
import { Menu, Home, ShoppingBag, Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";
import { useRouter } from "next/router";
import * as React from "react";

interface MenuItem {
  name: string;
  price: string;
  image: string;
  description: string;
}

interface MenuItems {
  [key: string]: MenuItem[];
}

const menuItems: MenuItems = {
  Combos: [
    {
      name: "A La Carte",
      price: "$3",
      image:
        "https://olo-images-live.imgix.net/27/272ad84a8af2494ba7cb2eecbe0c2b7e.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=fb32dcae532d307a7bbc5d7cfd83278a",
      description: "Individual entrees & sides",
    },
    {
      name: "Bowl",
      price: "$7",
      image:
        "https://olo-images-live.imgix.net/72/7288570f72a54140a41afdcfbd0e8980.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=5c543defe38946e36a8694d0b149fda4",
      description: "1 side & 1 entree.",
    },
    {
      name: "Plate",
      price: "$10",
      image:
        "https://olo-images-live.imgix.net/dd/dd91fc53f7124f86ae7833eede4a802f.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=b08d9fd5cc269c84f2b223298752819d",
      description: "1 side & 2 entree.",
    },
    {
      name: "Bigger Plate",
      price: "$13",
      image:
        "https://olo-images-live.imgix.net/39/39cf53c131764ddbb70efaedaaf60201.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=c60acecc206a1ae26f7ce8c6cef07399",
      description: "1 side & 3 entree.",
    },
  ],
  Sides: [
    {
      name: "White Rice",
      price: "$7",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Sides_WhiteSteamedRice.png",
      description: "1 side & 1 entree.",
    },
    {
      name: "Brown Rice",
      price: "$7",
      image:
        "https://www.pandaexpress.kr/sites/jp/files/how-to-panda/product-2-3.jpg",
      description: "1 side & 1 entree.",
    },
    {
      name: "Chow Mein",
      price: "$7",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Sides_ChowMein.png",
      description: "1 side & 1 entree.",
    },
    {
      name: "Super Greens",
      price: "$7",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Vegetables_SuperGreens.png",
      description: "1 side & 1 entree.",
    },
    {
      name: "Fried Rice",
      price: "$7",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Sides_FriedRice.png",
      description: "1 side & 1 entree.",
    },

  ],
  Entrees: [
    {
      name: "Orange Chicken",
      price: "$3.50",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Chicken_OrangeChicken.png",
      description: "Crispy chicken in tangy orange sauce.",
    },
    {
      name: "Beijing Beef",
      price: "$3.50",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Beef_BeijingBeef.png",
      description: "Savory beef with peppers and onions.",
    },
    {
      name: "Mushroom Chicken",
      price: "$3.50",
      image:
        "https://olo-images-live.imgix.net/8b/8b254283b24a4643949f9dc649a5bbca.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=5c71dcc68a77256b11d3628316d777cd",
      description: "Tender chicken with mushrooms and zucchini.",
    },
    {
      name: "Teriyaki Chicken",
      price: "$3.50",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Chicken_GrilledTeriyakiChicken.png",
      description: "Grilled chicken with teriyaki sauce.",
    },
    {
      name: "Kung Pao Chicken",
      price: "$3.50",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Chicken_KungPaoChicken.png",
      description: "Spicy chicken with peanuts and vegetables.",
    },
    {
      name: "Black Pepper Chicken",
      price: "$3.50",
      image:
        "https://olo-images-live.imgix.net/53/53efafba80ed4363b8a3a632a4806565.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=8807d429304c6d38fb8c40203de6e3cd",
      description: "Chicken with black pepper and celery.",
    },
    {
      name: "Firecracker Shrimp",
      price: "$3.50",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbuO4WDiqaVBQWvxzs5iCaoPQiaoBzpjkYzw&s",
      description: "Spicy shrimp with bell peppers.",
    },
    {
      name: "Honey Walnut Shrimp",
      price: "$3.50",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Seafood_HoneyWalnutShrimp.png",
      description: "Crispy shrimp with honey sauce and walnuts.",
    },
    {
      name: "Broccoli Beef",
      price: "$3.50",
      image:
        "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Beef_BroccoliBeef.png",
      description: "Beef with broccoli in savory sauce.",
    },
  ],
  Appetizers: [
    {
      name: "Cream Cheese Rangoon",
      price: "$2",
      image:
        "https://olo-images-live.imgix.net/fe/fef7db209d7d41e6ae065af16afa1577.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=f14d518edf4e7ee0fd22b4d3cddc59b8",
      description: "3 Cream Cheese Rangoons.",
    },
    {
      name: "Chicken Egg Roll",
      price: "$2",
      image:
        "https://olo-images-live.imgix.net/52/524bbb9023e2409b8d3fceae944a808f.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=4f4cc30df356786bbe3968181f8c5160",
      description: "2 Chicken Egg Rolls.",
    },
    {
      name: "Veggie Spring Roll",
      price: "$2",
      image:
        "https://olo-images-live.imgix.net/18/183834b8a35a4737a73a28421f68b4f0.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=0d4be7c417ec1998251da41d5bfe13fb",
      description: "2 Veggie Spring Rolls.",
    },
  ],
  Drinks: [
    {name: "Fountain Drink", price: '$2.50', image: 'https://olo-images-live.imgix.net/05/0543dea3f26343c197194e1102d44d25.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=875daff9982b3bafd3f9d890f31f50cb', description: '1 fountain drink.'} 
],
};

const weatherIcons = {
  clear: <Sun className="h-6 w-6" />,
  clouds: <Cloud className="h-6 w-6" />,
  rain: <CloudRain className="h-6 w-6" />,
  snow: <CloudSnow className="h-6 w-6" />,
};

const CustomerKiosk: React.FC = () => {
  const router = useRouter();
  const [selectedSides, setSelectedSides] = React.useState<number>(0);
  const [currentItemType, setCurrentItemType] = React.useState<string | null>(null);
  const [selectedEntrees, setSelectedEntrees] = React.useState<number>(0);
  const [order, setOrder] = React.useState<MenuItem[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("Combos");
  const [mode, setMode] = React.useState<string>("Customer Self-Service");
  const [weather, setWeather] = React.useState<{ temperature?: number; description?: string } | null>(null);

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
      if (category === 'Sides' && selectedSides >= 1) return;
      if (category === 'Entrees' && selectedEntrees >= 2) return;
    } else if (currentItemType === "Bigger Plate") {
      if (category === 'Sides' && selectedSides >= 1) return;
      if (category === 'Entrees' && selectedEntrees >= 3) return;
    } else if (currentItemType === "Bowl") {
      if (category === 'Sides' && selectedSides >= 1) return;
      if (category === 'Entrees' && selectedEntrees >= 1) return;
    }

    setOrder([...order, item]);
    setTotal(total + parseFloat(item.price.replace("$", "")));

    if (category === 'Sides') setSelectedSides(selectedSides + 1);
    if (category === 'Entrees') setSelectedEntrees(selectedEntrees + 1);
    
  };

  const removeFromOrder = (index: number): void => {
    const item = order[index];
    const itemPrice = parseFloat(item.price.replace("$", ""));
    const newOrder = order.filter((_, i) => i !== index);
  
    // Adjust counters based on the item category
    if (selectedCategory === 'Sides') {
      setSelectedSides(Math.max(0, selectedSides - 1));
    } else if (selectedCategory === 'Entrees') {
      setSelectedEntrees(Math.max(0, selectedEntrees - 1));
    }
  
    // Reset item type only if removing all main items or if the main item itself is removed
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
    if (!weather?.description) return null;
    const description = weather.description.toLowerCase();

    if (description.includes('clear')) return weatherIcons.clear;
    if (description.includes('cloud')) return weatherIcons.clouds;
    if (description.includes('rain')) return weatherIcons.rain;
    if (description.includes('snow')) return weatherIcons.snow;

    return <Cloud className="h-6 w-6" />; // Default icon
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-red-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="text-white hover:text-white hover:bg-red-700"
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
          {/* Weather display */}
          {weather && (
            <div className="flex items-center gap-2">
              {getWeatherIcon()} {/* Weather icon */}
              <span style={{ marginLeft: '5px' }}>
                {weather.temperature !== undefined ? `${Math.round(weather.temperature)}°F` : 'N/A'}, {weather.description}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="font-bold">{order.length} items</span>
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-red-700"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="text-black bg-white p-2 rounded-md shadow-lg">
              <DropdownMenu.Item
                onClick={() => handleModeChange("Cashier")}
                className="cursor-pointer px-2 py-1 hover:bg-gray-200"
              >
                Cashier
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => handleModeChange("Customer Self-Service")}
                className="cursor-pointer px-2 py-1 hover:bg-gray-200"
              >
                Customer Self-Service
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => handleModeChange("Manager")}
                className="cursor-pointer px-2 py-1 hover:bg-gray-200"
              >
                Manager
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </nav>

      <div className="container mx-auto p-6 flex gap-6">
        {/* Menu Section */}
        <div className="flex-1">
          <div className="flex gap-4 mb-6">
            {Object.keys(menuItems).map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className="flex-1"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {menuItems[selectedCategory].map((item) => (
              <Card key={item.name} className="overflow-hidden">
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
                  <span className="font-bold">{item.price}</span>
                  <Button
                  onClick={() => addToOrder(item, selectedCategory)}
                  disabled={
                    currentItemType === "Plate" &&
                    ((selectedCategory === 'Sides' && selectedSides >= 1) ||
                    (selectedCategory === 'Entrees' && selectedEntrees >= 2)) ||

                    currentItemType === "Bigger Plate" &&
                    ((selectedCategory === 'Sides' && selectedSides >= 1) ||
                    (selectedCategory === 'Entrees' && selectedEntrees >= 3)) ||

                    currentItemType === "Bowl" &&
                    ((selectedCategory === 'Sides' && selectedSides >= 1) ||
                    (selectedCategory === 'Entrees' && selectedEntrees >= 1))
                  }
                >Add to Order</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
            <CardDescription>Review and customize your meal</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {order.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.price}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromOrder(index)}
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
              className="w-full mt-4"
              disabled={order.length === 0}
              onClick={() => router.push("/orderType")}
            >
              Checkout ({order.length} items)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CustomerKiosk;
