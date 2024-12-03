// File: components/CustomerKiosk.tsx

import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
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
import { Home, ShoppingBag, Sun, Moon, Cloud, CloudMoon, CloudRain, CloudSnow, ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import * as React from "react";

interface MenuItem {
  menu_item_id: number;
  price: number;
  item_type: string;
  name: string;
  image: string;
  description: string;
  special: boolean;
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
  const [menuItems, setMenuItems] = useState<MenuItems>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSides, setSelectedSides] = useState<number>(0);
  const [currentItemType, setCurrentItemType] = useState<string | null>(null);
  const [selectedEntrees, setSelectedEntrees] = useState<number>(0);
  const [carteSelected, setCarteSelected] = useState<string | null>(null);
  const [order, setOrder] = useState<MenuItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Combos");
  const [mode, setMode] = useState<string>("Customer Self-Service");
  const [weather, setWeather] = useState<{ temperature?: number; description?: string; isDay?: boolean } | null>(null);
  const { theme } = useTheme();

  // Language and Translation States
  const [language, setLanguage] = useState<string>('en'); // default to English
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // New state for dropdown

  // Define available languages
  const availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    // Add more languages as needed
  ];

  // Define translation keys
  const translationKeys = {
    mode: 'Customer Self-Service',
    items: 'items',
    checkout: 'Checkout',
    yourOrder: 'Your Order',
    reviewCustomize: 'Review and customize your meal',
    subtotal: 'Subtotal',
    tax: 'Tax',
    total: 'Total',
    addToOrder: 'Add to Order',
    remove: 'Remove',
    loading: 'Loading menu items...',
    // Add more keys as needed
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "night");
  }, [theme]);

  const categoryOrder = ["Combos", "Side", "Entree", "Appetizer", "Drink"];

  // Load sessionStorage on component mount
  useEffect(() => {
    console.log('Loading from sessionStorage', {
      order: sessionStorage.getItem('order'),
    });
    const storedOrder = sessionStorage.getItem('order');
    const storedTotal = sessionStorage.getItem('total');
    const storedSelectedSides = sessionStorage.getItem('selectedSides');
    const storedSelectedEntrees = sessionStorage.getItem('selectedEntrees');
    const storedCurrentItemType = sessionStorage.getItem('currentItemType');
    const storedCarteSelected = sessionStorage.getItem('carteSelected');
    const storedLanguage = sessionStorage.getItem('language');

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

    if (storedCarteSelected) {
      setCarteSelected(storedCarteSelected || null);
    }

    // if (storedLanguage) {
    //   setLanguage(storedLanguage);
    //   if (storedLanguage !== 'en') {
    //     fetchTranslations(storedLanguage);
    //   }
    // }
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
      language,
    });

    sessionStorage.setItem('order', JSON.stringify(order));
    sessionStorage.setItem('total', total.toString());
    sessionStorage.setItem('selectedSides', selectedSides.toString());
    sessionStorage.setItem('selectedEntrees', selectedEntrees.toString());
    sessionStorage.setItem('currentItemType', currentItemType || '');
    sessionStorage.setItem('carteSelected', carteSelected || '');
    sessionStorage.setItem('language', language);

    // Store menu item IDs
    const menuItemIds = order.map(item => item.menu_item_id);
    sessionStorage.setItem('menuItemIds', JSON.stringify(menuItemIds));
  }, [order, total, selectedSides, selectedEntrees, currentItemType, carteSelected, language]);

  // Fetch menu items on component mount
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
      } else if (item.name === "A La Carte") {
        setCurrentItemType("A La Carte");
        setCarteSelected(null);
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
    } else if (currentItemType === "A La Carte") {
      if ((category === 'Side' || category === 'Entree') && (selectedSides >= 1 || selectedEntrees >= 1)) return;
      if (carteSelected === 'Side' || carteSelected === 'Entree') return;
    }

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

    if (category === 'Side') setSelectedSides(selectedSides + 1);
    if (category === 'Entree') setSelectedEntrees(selectedEntrees + 1);
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
  };

  const handleCheckout = () => {
    sessionStorage.setItem('paymentAmount', parseFloat((total * 1.0825).toFixed(2)).toString());
    sessionStorage.setItem('order', JSON.stringify(order));
    sessionStorage.setItem('menuItemIds', JSON.stringify(order.map(item => item.menu_item_id)));
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
  useEffect(() => {
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

  // Fetch translations using bulk API
  // const fetchTranslations = async (languageCode: string) => {
  //   try {
  //     const response = await fetch('/api/translate', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         texts: Object.values(translationKeys), // Send all translation keys as texts
  //         targetLanguage: languageCode,
  //       }),
  //     });
  
  //     if (response.ok) {
  //       const data = await response.json();
  //       const newTranslations = data.translatedTexts.reduce((acc: any, translatedText: string, index: number) => {
  //         const key = Object.keys(translationKeys)[index];
  //         acc[key] = translatedText;
  //         return acc;
  //       }, {});
  //       setTranslations(newTranslations);
  //     } else {
  //       console.error('Translation API failed');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching translations:', error);
  //   }
  // };
  // // Handle language change with caching
  // const handleLanguageChange = async (newLanguage: string) => {
  //   setLanguage(newLanguage);
  //   setDropdownOpen(false); // Close the dropdown after selection

  //   if (newLanguage === 'en') {
  //     setTranslations({});
  //     return;
  //   }

  //   // Check if translations for the selected language are cached
  //   const cachedTranslations = localStorage.getItem(`translations_${newLanguage}`);
  //   if (cachedTranslations) {
  //     setTranslations(JSON.parse(cachedTranslations));
  //     return;
  //   }

  //   // Fetch translations from the API
  //   await fetchTranslations(newLanguage);
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span>{translations['loading'] || 'Loading menu items...'}</span>
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
        {/* Left Side */}
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

        {/* Center: Mode Title */}
        <h1 className="text-xl font-bold">
          {translations['mode'] || mode}
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative inline-block text-left">
            {/* <Button 
              variant="ghost" 
              size="icon" 
              className="flex items-center" 
              onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
            >
              <span>{availableLanguages.find(lang => lang.code === language)?.label}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button> */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {/* {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {lang.label}
                    </button>
                  ))} */}
                </div>
              </div>
            )}
          </div>

          {/* Weather and Order Info */}
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
            <span className="font-bold">{translations['items'] || `${order.length} items`}</span>
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
                    selectedCategory === category 
                      ? theme === 'night' 
                        ? 'bg-gray-700 text-white border-gray-600' 
                        : 'bg-gray-200 text-black border-gray-300 hover:bg-gray-200'
                      : theme === 'night'
                        ? 'bg-gray-900 text-white border-gray-700 hover:bg-gray-700'
                        : 'bg-white text-black border-gray-300 hover:bg-gray-200' 
                  }`}
                >
                  <span className="font-bold" style={{fontSize: '1rem'}}>{category}</span>
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
                <CardTitle className="text-lg">
                  {item.name}
                  {item.special && <span className="text-sm font-semibold text-red-500"> (+$1.50)</span>}
                </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <span className="font-bold">${item.price.toFixed(2)}</span>
                  <Button
                    onClick={() => addToOrder(item, selectedCategory)}
                    disabled={
                      currentItemType === "Plate" &&
                      ((selectedCategory === 'Side' && selectedSides >= 1) ||
                      (selectedCategory === 'Entree' && selectedEntrees >= 2)) ||
  
                      currentItemType === "Bigger Plate" &&
                      ((selectedCategory === 'Side' && selectedSides >= 1) ||
                      (selectedCategory === 'Entree' && selectedEntrees >= 3)) ||
  
                      currentItemType === "Bowl" &&
                      ((selectedCategory === 'Side' && selectedSides >= 1) ||
                      (selectedCategory === 'Entree' && selectedEntrees >= 1)) ||

                      currentItemType === "A La Carte" &&
                      ((selectedCategory === 'Side' && (selectedSides >= 1 || selectedEntrees >= 1)) ||
                      (selectedCategory === 'Entree' && (selectedSides >= 1 || selectedEntrees >= 1))) ||

                      currentItemType === null && 
                      (selectedCategory === 'Side' || selectedCategory === 'Entree')
                      
                    }
                    className={`${
                      theme === 'night'
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-900'
                    }`}
                  >
                    {translations['addToOrder'] || 'Add to Order'}
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
            <CardTitle>{translations['yourOrder'] || 'Your Order'}</CardTitle>
            <CardDescription>{translations['reviewCustomize'] || 'Review and customize your meal'}</CardDescription>
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
                    {translations['remove'] || 'Remove'}
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col items-start">
            <div className="flex justify-between w-full mb-2">
              <span>{translations['subtotal'] || 'Subtotal'}:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full mb-2">
              <span>{translations['tax'] || 'Tax'}:</span>
              <span>${(total * 0.0825).toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full font-bold">
              <span>{translations['total'] || 'Total'}:</span>
              <span>${(total * 1.0825).toFixed(2)}</span>
            </div>
            <Button
              className={`w-full mt-4 ${
                theme === 'night' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
              }`}
              disabled={order.length === 0}
              onClick={handleCheckout}
            >
              {translations['checkout'] || `Checkout (${order.length} items)`}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Chatbot/>
    </div>
  );

};

export default CustomerKiosk;
