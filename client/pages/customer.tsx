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
import { getUserLocation, getWeatherData } from "@/utils/apiHelpers";
import { Home, ShoppingBag, Sun, Cloud, CloudRain, CloudSnow, ChevronDown } from "lucide-react";
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
  clear: <Sun className="h-6 w-6" />,
  clouds: <Cloud className="h-6 w-6" />,
  rain: <CloudRain className="h-6 w-6" />,
  snow: <CloudSnow className="h-6 w-6" />,
};

// Define category translations
const categoryTranslations: Record<string, Record<string, string>> = {
  en: {
    "Combos": "Combos",
    "Combo": "Combo",
    "Side": "Side",
    "Entree": "Entree",
    "Appetizer": "Appetizer",
    "Drink": "Drink",
  },
  es: {
    "Combos": "Combinaciones", // Updated translation
    "Combo": "Combo", 
    "Side": "Acompañamiento",
    "Entree": "Entrada",
    "Appetizer": "Aperitivo",
    "Drink": "Bebida",
  },
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
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Language dropdown state

  const availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    // Add more languages as needed
  ];

  const translationKeys = [
    { key: 'mode', text: 'Customer Self-Service' },
    { key: 'items', text: 'items' },
    { key: 'checkout', text: 'Checkout' },
    { key: 'yourOrder', text: 'Your Order' },
    { key: 'reviewCustomize', text: 'Review and customize your meal' },
    { key: 'subtotal', text: 'Subtotal' },
    { key: 'tax', text: 'Tax' },
    { key: 'total', text: 'Total' },
    { key: 'addToOrder', text: 'Add to Order' },
    { key: 'remove', text: 'Remove' },
    { key: 'loading', text: 'Loading menu items...' },
    { key: 'welcome', text: 'Welcome to the home page!' },
    { key: 'clear', text: 'Clear Order' },

    { key: 'category_Combos', text: 'Combos' },
    { key: 'category_Side', text: 'Side' },
    { key: 'category_Entree', text: 'Entree' },
    { key: 'category_Appetizer', text: 'Appetizer' },
    { key: 'category_Drink', text: 'Drink' },
  ];

  // useEffect(() => {
  //   console.log('Translations:', translations);
  // }, [translations]);
  const categoryOrder = ["Combos", "Side", "Entree", "Appetizer", "Drink"];

  
  //Helper for translations
  const fetchTranslations = async (languageCode: string) => {
    try {
      const staticTexts = translationKeys.map(k => k.text);

      const dynamicTexts = Object.values(menuItems)
        .flat()
        .map(item => item.name)
        .concat(Object.values(menuItems).flat().map(item => item.description));

      const allTexts = [...staticTexts, ...dynamicTexts];

      console.log(`Sending texts for translation: ${allTexts.length} texts`);
      console.log('Texts to translate:', allTexts);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: allTexts,
          targetLanguage: languageCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { translatedTexts } = data;

        console.log(`Received translations: ${translatedTexts.length} translations`);
        console.log('Translated texts:', translatedTexts);

        if (translatedTexts.length !== allTexts.length) {
          console.error('Mismatch between texts sent and translations received.');
          return;
        }

        const newTranslations: Record<string, string> = {};

        // Assign static translations
        translationKeys.forEach((k, index) => {
          newTranslations[k.key] = translatedTexts[index];
        });

        // Assign dynamic translations
        let dynamicIndex = staticTexts.length;
        Object.values(menuItems)
          .flat()
          .forEach(item => {
            const nameTranslation = translatedTexts[dynamicIndex++];
            const descriptionTranslation = translatedTexts[dynamicIndex++];
            newTranslations[`name_${item.menu_item_id}`] = nameTranslation;
            newTranslations[`description_${item.menu_item_id}`] = descriptionTranslation;
          });

        setTranslations(newTranslations);
        localStorage.setItem(`translations_${languageCode}`, JSON.stringify(newTranslations));

        console.log('Translations fetched and applied successfully.');
      } else {
        const error = await response.json();
        console.error('Translation API failed:', error.error);
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
  };

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Fetch menu items from the API
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
  
          // If Spanish is selected, translate the menu items
          if (language === 'es') {
            const textsToTranslate = data.menuItems.flatMap((item: MenuItem) => [
              { type: 'name', text: item.name, id: item.menu_item_id },
              { type: 'description', text: item.description, id: item.menu_item_id },
            ]);
  
            const translationResponse = await fetch('/api/translate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                texts: textsToTranslate.map((t: { type: string; text: string; id: number }) => t.text),
                targetLanguage: 'es',
              }),
            });
  
            if (translationResponse.ok) {
              const translationData = await translationResponse.json();
              const translatedTexts = translationData.translatedTexts;
  
              // Map translations back to the original items by their IDs
              const idToTranslations: { [key: string]: { name?: string; description?: string } } = {};
              textsToTranslate.forEach((original: { type: string; text: string; id: number }, index: number) => {
                if (!idToTranslations[original.id]) {
                  idToTranslations[original.id] = {};
                }
                idToTranslations[original.id][original.type as 'name' | 'description'] = translatedTexts[index];
              });
  
              // Update the items with translations
              data.menuItems.forEach((item: MenuItem) => {
                if (idToTranslations[item.menu_item_id]) {
                  item.name = idToTranslations[item.menu_item_id].name || item.name;
                  item.description = idToTranslations[item.menu_item_id].description || item.description;
                }
              });
  
              // Reorganize the menu items by category with translated names and descriptions
              const translatedItemsByCategory = data.menuItems.reduce((acc: MenuItems, item: MenuItem) => {
                const category = item.item_type;
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push(item);
                return acc;
              }, {});
  
              setMenuItems(translatedItemsByCategory);
            } else {
              console.error('Failed to translate menu items');
            }
          } else {
            setMenuItems(itemsByCategory);
          }
  
          console.log('Menu items fetched successfully:', itemsByCategory);
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
  }, [language]);
  
  

  // Load sessionStorage on component mount
  useEffect(() => {
    console.log('Loading from sessionStorage', {
      order: sessionStorage.getItem('order'),
      language: sessionStorage.getItem('language'),
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
      console.log('Loaded order from sessionStorage:', JSON.parse(storedOrder));
    }

    if (storedTotal) {
      setTotal(parseFloat(storedTotal));
      console.log('Loaded total from sessionStorage:', parseFloat(storedTotal));
    }

    if (storedSelectedSides) {
      setSelectedSides(parseInt(storedSelectedSides));
      console.log('Loaded selectedSides from sessionStorage:', parseInt(storedSelectedSides));
    }

    if (storedSelectedEntrees) {
      setSelectedEntrees(parseInt(storedSelectedEntrees));
      console.log('Loaded selectedEntrees from sessionStorage:', parseInt(storedSelectedEntrees));
    }

    if (storedCurrentItemType) {
      setCurrentItemType(storedCurrentItemType || null);
      console.log('Loaded currentItemType from sessionStorage:', storedCurrentItemType || null);
    }

    if (storedCarteSelected) {
      setCarteSelected(storedCarteSelected || null);
    }
    if (storedLanguage) {
      setLanguage(storedLanguage);
      if (storedLanguage !== 'en') {
        // Translations will be fetched in the subsequent useEffect
        const cachedTranslations = localStorage.getItem(`translations_${storedLanguage}`);
        if (cachedTranslations) {
          setTranslations(JSON.parse(cachedTranslations));
          console.log(`Loaded translations from cache for language: ${storedLanguage}`);
        } else {
          fetchTranslations(storedLanguage);
        }
      }
    }
  }, []); // Added menuItems as a dependency to ensure menuItems are loaded before translations

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
    sessionStorage.setItem('userRole', 'customer');
    sessionStorage.setItem('staff_id', '0');

    // Store menu item IDs
    const menuItemIds = order.map(item => item.menu_item_id);
    sessionStorage.setItem('menuItemIds', JSON.stringify(menuItemIds));
  }, [order, total, selectedSides, selectedEntrees, currentItemType, carteSelected, language]);

  // Listen for languageChange events to update language state
  useEffect(() => {
    const handleLanguageEvent = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const newLanguage = customEvent.detail;
      if (newLanguage !== language) {
        setLanguage(newLanguage);
        console.log(`Language changed via event: ${newLanguage}`);
      }
    };

    window.addEventListener('languageChange', handleLanguageEvent);

    return () => {
      window.removeEventListener('languageChange', handleLanguageEvent);
    };
  }, [language]);

  // Fetch translations whenever language or menuItems change
  useEffect(() => {
    if (language !== 'en' && Object.keys(menuItems).length > 0) {
      const cachedTranslations = localStorage.getItem(`translations_${language}`);
      if (cachedTranslations) {
        setTranslations(JSON.parse(cachedTranslations));
        console.log(`Loaded translations from cache for language: ${language}`);
      } else {
        fetchTranslations(language);
      }
    } else if (language === 'en') {
      setTranslations({});
      console.log('Language set to English. Clearing translations.');
    }
  }, [language, menuItems]);

  // Handle language change with caching and event dispatch
  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    setDropdownOpen(false); // Close the dropdown after selection
    console.log(`Language changed to: ${newLanguage}`);

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLanguage }));

    if (newLanguage === 'en') {
      setTranslations({});
      console.log('Language set to English. Clearing translations.');
      return;
    }

    // Check if translations for the selected language are cached
    const cachedTranslations = localStorage.getItem(`translations_${newLanguage}`);
    if (cachedTranslations) {
      setTranslations(JSON.parse(cachedTranslations));
      console.log(`Loaded translations from cache for language: ${newLanguage}`);
      return;
    }

    // Fetch translations from the API
    await fetchTranslations(newLanguage);
  };

  const addToOrder = (item: MenuItem, category: string): void => {
    // Logic for handling combo selections
    if (category === 'Combos') {
      if (item.name === "Plate" || item.name === "Lámina") {
        setCurrentItemType("Plate");
        setSelectedSides(0);
        setSelectedEntrees(0);
      } else if (item.name === "Bigger Plate" || item.name == "Plato más grande") {
        setCurrentItemType("Bigger Plate");
        setSelectedSides(0);
        setSelectedEntrees(0);
      } else if (item.name === "Bowl" || item.name === "Bol") {
        setCurrentItemType("Bowl");
        setSelectedSides(0);
        setSelectedEntrees(0);
      } else if (item.name === "A La Carte" || item.name === "A la carta") {
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
    if((category === 'Combos' && item.name !== "A La Carte") || (category === 'Combos' && item.name === "A la carta")) {
      setTotal(total + item.price);
    } else if (category === 'Appetizer' || category === 'Drink') {
      setTotal(total + item.price);
    }

    if (currentItemType === "A La Carte") {
      if(item.name !== "A La Carte" && item.name !== "A la carta") {
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
    newOrder.splice(index, 1); // Remove the selected item

    if (
      (currentItemType === "Plate" ||
       currentItemType === "Bigger Plate" ||
       currentItemType === "Bowl" ||
       currentItemType === "A La Carte") &&
      (item.item_type === "Side" || item.item_type === "Entree")
    ) {
      if (item.item_type === "Side") {
        setSelectedSides(prev => Math.max(0, prev - 1));
      } else if (item.item_type === "Entree") {
        setSelectedEntrees(prev => Math.max(0, prev - 1));
      }
  
      if (currentItemType === "A La Carte") {
        if (item.item_type === "Side" && carteSelected === "Side") {
          setCarteSelected(null);
        } else if (item.item_type === "Entree" && carteSelected === "Entree") {
          setCarteSelected(null);
        }
        if (item.name !== "A La Carte") {
          setTotal(prevTotal => Math.max(0, prevTotal - item.price));
        }
      }
    }
  
    if (item.item_type === "Appetizer" || item.item_type === "Drink") {
      setTotal(prevTotal => Math.max(0, prevTotal - item.price));
    }
  
    if (item.special) {
      setTotal(prevTotal => Math.max(0, prevTotal - 1.5));
    }
  
    if (["Plate", "Bowl", "Bigger Plate"].includes(item.name)) {
      setTotal(prevTotal => Math.max(0, prevTotal - item.price));
  
      let sidesToRemove = 0;
      let entreesToRemove = 0;
  
      sidesToRemove = selectedSides;
      entreesToRemove = selectedEntrees;
  
      const itemsToRemove = [];
      for (let i = newOrder.length - 1; i >= 0 && (sidesToRemove > 0 || entreesToRemove > 0); i--) {
        const currentItem = newOrder[i];
        if (sidesToRemove > 0 && currentItem.item_type === "Side") {
          sidesToRemove--;
          itemsToRemove.push(i);
        } else if (entreesToRemove > 0 && currentItem.item_type === "Entree") {
          entreesToRemove--;
          itemsToRemove.push(i);
        }
      }
  
      const specialItemsCount = itemsToRemove.reduce(
        (count, i) => (newOrder[i].special ? count + 1 : count),
        0
      );
      setTotal(prevTotal => Math.max(0, prevTotal - specialItemsCount * 1.5));
  
      itemsToRemove.sort((a, b) => b - a).forEach(i => newOrder.splice(i, 1));
  
      setCurrentItemType(null);
      setSelectedSides(0);
      setSelectedEntrees(0);
    } else if (currentItemType === "A La Carte" && item.name === "A La Carte") {
      let sidesToRemove = 0;
      let entreesToRemove = 0;
      if (carteSelected === "Side") sidesToRemove = selectedSides;
      if (carteSelected === "Entree") entreesToRemove = selectedEntrees;
  
      const itemsToRemove = [];
      for (let i = newOrder.length - 1; i >= 0 && (sidesToRemove > 0 || entreesToRemove > 0); i--) {
        const currentItem = newOrder[i];
        if (sidesToRemove > 0 && currentItem.item_type === "Side") {
          sidesToRemove--;
          itemsToRemove.push(i);
        } else if (entreesToRemove > 0 && currentItem.item_type === "Entree") {
          entreesToRemove--;
          itemsToRemove.push(i);
        }
      }
  
      itemsToRemove.sort((a, b) => b - a).forEach((i) => {
        const removedItem = newOrder.splice(i, 1)[0];
        if (removedItem.name !== "A La Carte" ) {
          setTotal(prevTotal => Math.max(0, prevTotal - removedItem.price));
        } 
      });
  
      setSelectedSides(0);
      setSelectedEntrees(0);
      setCarteSelected(null);
      setCurrentItemType(null);
    }
  
    setOrder(newOrder);
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
          console.log('Weather data fetched:', weatherData);
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
  
    if (description.includes("clear")) return weatherIcons.clear;
    if (description.includes("cloud")) return weatherIcons.clouds;
    if (description.includes("rain")) return weatherIcons.rain;
    if (description.includes("snow")) return weatherIcons.snow;
  
    return <Cloud className="h-6 w-6" />; // Default icon
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span>{translations['loading'] || 'Loading menu items...'}</span>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${theme === 'night' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Navbar */}
      <nav
        className={`p-4 flex items-center justify-between ${
          theme === 'night' ? 'bg-red-800 text-white' : 'bg-red-600 text-white'
        }`}
        style={{
          backgroundColor: 'var(--primary)',
          color: 'var(--foreground)'
        }}
      >
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
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
  <button
    className={`flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
      dropdownOpen ? "ring-2 ring-gray-400" : ""
    }`}
    onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
  >
    <span className="font-semibold">
      {availableLanguages.find((lang) => lang.code === language)?.label}
    </span>
    <ChevronDown className="ml-2 h-4 w-4 text-gray-600" />
  </button>
  {dropdownOpen && (
    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
      <ul className="py-2">
        {availableLanguages.map((lang) => (
          <li key={lang.code}>
            <button
              onClick={() => handleLanguageChange(lang.code)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            >
              {lang.label}
            </button>
          </li>
        ))}
      </ul>
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
            <span className="font-bold">
              {translations['items'] || `${order.length} items`}
            </span>
          </div>
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
                    {categoryTranslations[language][category] || category}
                  </span>
                </Button>
              )
            ))}
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-2 gap-4">
            {menuItems[selectedCategory]?.map((item) => (
              <Card
                key={item.menu_item_id} // Use unique identifier as key
                className={`overflow-hidden ${
                  theme === 'night' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                }`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={translations[`name_${item.menu_item_id}`] || item.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardHeader>
                  <CardTitle 
                    className="text-lg">{item.name}
                  </CardTitle>
                  
                  <CardDescription>
                    {translations[`description_${item.menu_item_id}`] || item.description}
                    {item.special && (
                      <span className="text-red-500 font-bold ml-2">
                          {translations['Premium'] || '(Premium)'}
                      </span>
                    )}
                  </CardDescription>

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
                    <div className="font-medium">{translations[`name_${item.menu_item_id}`] || item.name}</div>
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
            <Button
              className={`w-full mt-4 ${
                theme === 'night' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
              }`}
              disabled={order.length === 0}
              onClick={clearOrder}
            >
                {language === 'es' ? 'Borrar orden' : 'Clear Order'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Chatbot/>
    </div>
  );

};

export default CustomerKiosk;
