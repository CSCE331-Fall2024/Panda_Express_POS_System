import React from 'react';
import { useRouter } from 'next/router';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SidebarMenu: React.FC = () => {
  const router = useRouter();

  return (
    <aside className="w-16 bg-muted flex flex-col items-center py-4 space-y-4">
      <Button variant="ghost" size="icon" onClick={() => router.push('/login')}>
        <LogOut className="h-6 w-6" />
      </Button>
    </aside>
  );
};

export default SidebarMenu;
