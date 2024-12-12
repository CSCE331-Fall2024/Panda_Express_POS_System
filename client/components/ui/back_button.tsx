/**
 * Represents a back button component.
 * 
 * @remarks
 * This component provides a back button for navigation.
 * 
 * @returns {JSX.Element} The rendered back button component.
 */
import { FC } from 'react';
import { buttonStyle } from '@/utils/tableStyles';
import { useRouter } from 'next/router';
import { ArrowBigLeft } from 'lucide-react';

/**
 * Represents the back button component.
 * 
 * @remarks
 * This component provides a back button for navigation.
 * 
 * @returns {JSX.Element} The rendered back button component.
 */
export const BackButton: FC = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.push('/manager')} style={buttonStyle}>
      <ArrowBigLeft size={24}/>
    </button>
  );
};

export default BackButton;
