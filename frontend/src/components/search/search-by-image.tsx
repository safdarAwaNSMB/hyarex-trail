'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button, Modal } from 'rizzui';
import SearchTrigger from '@/components/search/search-trigger';
import SearchList from '@/components/search/search-list';
import cn from '@/utils/class-names';
import SearchImage from './search-image';
import { useAtom } from 'jotai';

export default function SearchByImageWidget({
    className,
    placeholderClassName,
    icon,
}: {
    className?: string;
    icon?: React.ReactNode;
    placeholderClassName?: string;
}) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setOpen(!open);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    const pathname = usePathname();
    useEffect(() => {
        setOpen(() => false);
        return () => setOpen(() => false);
    }, [pathname]);

    return (
        <>
            <Button
                className={cn("mx-2", className)}
                onClick={() => setOpen(true)}
            // placeholderClassName={placeholderClassName}
            >Search By Image</Button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                overlayClassName="dark:bg-opacity-20 dark:bg-gray-50 dark:backdrop-blur-sm"
                containerClassName="dark:bg-gray-100/90 overflow-hidden dark:backdrop-blur-xl"
                className="z-[9999]"
            >
                <SearchImage setOpen={setOpen} />
            </Modal>
        </>
    );
}
