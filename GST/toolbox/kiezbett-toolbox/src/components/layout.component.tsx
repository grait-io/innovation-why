import React, { ReactNode } from 'react';
import HeaderComponent from './header.componnent';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from './ui/sidebar';
import { Link } from 'react-router-dom';
import { Spinner } from './ui/spinner';
import useAppStore from '@/store/app.store';
import Modal from './modal.component';
import { useOrderCounts } from '@/hooks/use-order.hook';

interface LayoutProps {
    children: ReactNode;
}

// Main layout component
const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { data: orderCounts } = useOrderCounts();
    const { loading, isModalOpen, setModalOpen, modalComment } = useAppStore();

    const handleCloseModal = () => setModalOpen(false);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Spinner show={loading} />
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} comment={modalComment} />

            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>Kiezbett Toolbox</SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarMenuButton asChild>
                                <Link to="/">Dashboard</Link>
                            </SidebarMenuButton>
                            <br></br>
                            <SidebarGroupLabel>Bestellungen</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/orders/open">
                                                Offen <span className="ml-auto text-gray-400"> {orderCounts?.open}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuButton asChild>
                                            <Link to="/orders/paid">
                                                Bezhalt <span className="ml-auto text-gray-400"> {orderCounts?.paid}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuButton asChild>
                                            <Link to="/orders/in-progress">
                                                In Bearbeitung <span className="ml-auto text-gray-400"> {orderCounts?.inProgress}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuButton asChild>
                                            <Link to="/orders/shipping">
                                                Im Versand <span className="ml-auto text-gray-400"> {orderCounts?.shipped}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuButton asChild>
                                            <Link to="/orders/completed">Abgeschlossen</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>

                <main className="flex flex-col sm:gap-4 sm:py-4 w-full">
                    <HeaderComponent></HeaderComponent>
                    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</div>
                </main>
            </SidebarProvider>

            {/* <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <HeaderComponent></HeaderComponent>
                <main className="flex flex-col sm:gap-4 sm:py-4">{children}</main>
            </div> */}
        </div>
    );
};

export default Layout;
