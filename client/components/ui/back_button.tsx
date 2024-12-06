import { FC } from 'react';
import { buttonStyle } from '@/utils/tableStyles';
import { useRouter } from 'next/router';
import { ArrowBigLeft } from 'lucide-react';

const BackButton: FC = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.push('/manager')} style={buttonStyle}>
      <ArrowBigLeft size={24}/>
    </button>
  );
};

export default BackButton;
