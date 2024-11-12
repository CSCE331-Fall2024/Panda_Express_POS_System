import React from 'react';
import { useRouter } from 'next/router';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const SidebarMenu: React.FC = () => {
  const router = useRouter();

  const handleModeChange = (newMode: string) => {
    router.push(`/${newMode.toLowerCase()}`);
  };

  return (
    <aside className="w-16 bg-muted flex flex-col items-center py-4 space-y-4">
      <Button variant="ghost" size="icon" onClick={() => router.push('/login')}>
        <LogOut className="h-6 w-6" />
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white p-2 rounded-md shadow-lg">
          {['Cashier', 'Customer Self-Service', 'Manager'].map((mode) => (
            <DropdownMenu.Item
              key={mode}
              onClick={() => handleModeChange(mode)}
              className="cursor-pointer px-2 py-1 hover:bg-gray-200"
            >
              {mode}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </aside>
  );
};

export default SidebarMenu;
