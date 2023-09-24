import React from "react";
import Head from 'next/head'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link,
    Button,

  } from "@nextui-org/react";
export const appName = "tsundocker"

export default withPageAuthRequired(function Layout({ children }) {
    const { user, error, isLoading } = useUser();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuItems = [
        "Profile",
        "Mypage",
        "Log Out",
    ];

    return user && (
    <div>
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle 
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <p className="font-bold text-inherit">tsundocker</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="sm:flex gap-4" justify="center">
                <NavbarItem>
                <Link color="foreground" href="#">
                    Features
                </Link>
                </NavbarItem>
                <NavbarItem isActive>
                <Link href="#" aria-current="page">
                    Customers
                </Link>
                </NavbarItem>
                <NavbarItem>
                <Link color="foreground" href="#">
                    Integrations
                </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                <Button as={Link} color="primary" href="#" variant="flat">
                    Sign Up
                </Button>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                    color={
                        index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                    }
                    className="w-full"
                    href="#"
                    size="lg"
                    >
                    {item}
                    </Link>
                </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
        <main>
            <div className="ml-40 mr-40">
                { children }
            </div>
        </main>
    </div>
  );
}
);