import { PawPrint } from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
      <PawPrint className="h-8 w-8" />
      <span className="text-2xl font-bold">Pawsitive Cart</span>
    </Link>
  );
};

export default Logo;
