import { SidebarTrigger } from "./ui/sidebar";

const AppHeader = () => {
    return (
        <header className="flex items-center shrink-0 h-14 gap-2 border-b px-4 bg-background">
            <SidebarTrigger/>
        </header>
    )
}

export default AppHeader;