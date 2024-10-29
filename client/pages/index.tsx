import * as React from "react"
import { useRouter } from "next/router" // Import useRouter
import { Menu, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
// temp

const menuItems = {
  combos: ["Bowl", "Plate", "Bigger Plate", "Biggest Plate"],
  sides: ["White Rice", "Brown Rice", "Chow Mein", "Fried Rice", "Super Greens"],
  entrees: [
    "Orange Chicken",
    "Beijing Beef",
    "Mushroom Chicken",
    "Teriyaki Chicken",
    "Kung Pao Chicken",
    "Black Pepper Chicken",
    "Firecracker Shrimp",
    "Honey Walnut Shrimp",
  ],
}

export default function PandaExpressPOS() {
  const router = useRouter() // Initialize useRouter for navigation
  const [order, setOrder] = React.useState<string[]>([])
  const [total, setTotal] = React.useState(0)
  const [mode, setMode] = React.useState("Customer Self-Service") // Default mode set to "Customer Self-Service"

  const addToOrder = (item: string) => {
    setOrder([...order, item])
    setTotal(total + 7.00) 
  }

  const removeFromOrder = (index: number) => {
    const newOrder = order.filter((_, i) => i !== index)
    setOrder(newOrder)
    setTotal(total - 7.00) 
  }

  // Handle navigation based on selected mode
  const handleModeChange = (newMode: string) => {
    setMode(newMode)
    if (newMode === "Cashier") {
      router.push("/cashier") 
    } else if (newMode === "Manager") {
      router.push("/manager") 
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-16 bg-muted flex flex-col items-center py-4 space-y-4">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6" />
        </Button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white p-2 rounded-md shadow-lg">
            <DropdownMenu.Item onClick={() => handleModeChange("Cashier")} className="cursor-pointer px-2 py-1 hover:bg-gray-200">
              Cashier
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => handleModeChange("Customer Self-Service")} className="cursor-pointer px-2 py-1 hover:bg-gray-200">
              Customer Self-Service
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => handleModeChange("Manager")} className="cursor-pointer px-2 py-1 hover:bg-gray-200">
              Manager
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </aside>
      <main className="flex-1 p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-primary">Welcome to Panda Express</h1>
          <p className="text-muted-foreground">We Wok For You</p>
          <h2 className="text-2xl font-semibold text-black mt-4">{mode} Mode</h2> 
        </header>
        <div className="flex gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="combos">
                <TabsList>
                  <TabsTrigger value="combos">Combos</TabsTrigger>
                  <TabsTrigger value="sides">Sides</TabsTrigger>
                  <TabsTrigger value="entrees">Entrees</TabsTrigger>
                </TabsList>
                <TabsContent value="combos">
                  <div className="grid grid-cols-2 gap-4">
                    {menuItems.combos.map((item) => (
                      <Button key={item} onClick={() => addToOrder(item)} variant="outline">
                        {item}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="sides">
                  <div className="grid grid-cols-2 gap-4">
                    {menuItems.sides.map((item) => (
                      <Button key={item} onClick={() => addToOrder(item)} variant="outline">
                        {item}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="entrees">
                  <div className="grid grid-cols-2 gap-4">
                    {menuItems.entrees.map((item) => (
                      <Button key={item} onClick={() => addToOrder(item)} variant="outline">
                        {item}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
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
                    <Button variant="ghost" size="sm" onClick={() => removeFromOrder(index)}>
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
                onClick={() => router.push("/payment")} 
              >
                Checkout
              </Button>
            </CardFooter>

          </Card>
        </div>
      </main>
    </div>
  )
}
