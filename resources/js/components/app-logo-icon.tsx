import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <div className="flex aspect-circle size-8 items-center justify-center rounded-md  bg-gray-200 dark:bg-gray-800 text-sidebar-primary-foreground overflow-hidden">
                <img 
                    src="/logo.png"
                    alt="Trucking 360 Logo"
                    className="size-8 object-contain"
                />
            </div>
    );
}
