import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md  bg-gray-200 dark:bg-gray-800 text-sidebar-primary-foreground overflow-hidden">
                <img 
                    src="/logo.png"
                    alt="Trucking 360 Logo"
                    className="size-8 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">Trucking 360 Website CMS</span>
            </div>
        </>
    );
}
