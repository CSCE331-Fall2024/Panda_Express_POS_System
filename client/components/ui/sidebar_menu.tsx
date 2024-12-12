/**
 * Represents a sidebar menu component.
 * 
 * @remarks
 * This component provides a sidebar menu with a logout button.
 * 
 * @returns {JSX.Element} The rendered sidebar menu component.
 */
import { FC } from 'react';
import { useRouter } from 'next/router';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SidebarMenu: FC = () => {
  const router = useRouter();

  return (
    <aside className="w-16 bg-muted flex flex-col items-center py-4 space-y-4">
      <Button variant="ghost" size="icon" onClick={() => router.push('/login')}>
        <LogOut className="h-6 w-6" style={{ transform: "scaleX(-1)" }} />
      </Button>
    </aside>
  );
};

export default SidebarMenu;
