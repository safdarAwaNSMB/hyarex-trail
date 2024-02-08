'use client';

import cn from '@/utils/class-names';
import { PiHeartBold} from 'react-icons/pi';

type FloatingWishlistButtonProps = {
  totalItems: number;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function FloatingWhishlistButton({
  totalItems,
  className,
  ...props
}: FloatingWishlistButtonProps) {
  return (
    <button
      className={cn(
        'fixed end-2 top-1/3 flex -translate-y-1/2 flex-col items-center justify-center gap-1.5 rounded-md bg-primary p-3 text-xs font-semibold text-primary-foreground shadow-[0_25px_50px_-12px_#000000] dark:shadow-[0_25px_50px_-12px_#ffffff39] dark:backdrop-blur-md',
        className
      )}
      {...props}
    >
      <PiHeartBold className="h-auto w-5" />
      <span>
        {totalItems} &nbsp; {totalItems > 1 ? 'Items' : 'Item'}
      </span>
    </button>
  );
}
