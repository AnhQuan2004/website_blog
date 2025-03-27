import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
// import { Menu, X, ChevronDown, Search, User } from 'lucide-react';
import { Menu, X, ChevronDown, Search, User, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/articles" },
  { name: "News", href: "/news" },
  {
    name: "Categories",
    // href: "#",
    href: "/categories",
    dropdown: [
      {
        name: "Artificial Intelligence",
        href: "/category/artificial-intelligence",
      },
      { name: "Web Development", href: "/category/web-development" },
      { name: "Cybersecurity", href: "/category/cybersecurity" },
      { name: "Quantum Computing", href: "/category/quantum-computing" },
    ],
  },
  { name: "About", href: "/about" },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm"
          : "py-4 bg-transparent"
      )}
    >
      <nav className="content-container flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight flex items-center"
          aria-label="TechTales Logo"
        >
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded mr-1">
            Tech
          </span>
          <span>Tales</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) =>
            link.dropdown ? (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center space-x-1 text-sm font-medium transition-colors relative",
                      isActive(link.href)
                        ? "text-primary"
                        : "hover:text-primary"
                    )}
                  >
                    <span>{link.name}</span>
                    <ChevronDown size={16} />
                    {isActive(link.href) && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {link.dropdown.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      asChild
                      className={cn(isActive(item.href) && "bg-secondary")}
                    >
                      <Link to={item.href}>{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  isActive(link.href)
                    ? "text-primary font-semibold"
                    : "hover:text-primary"
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transition-transform duration-200",
                    isActive(link.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            )
          )}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search size={20} />
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User size={20} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-background z-40 p-6 md:hidden transition-transform duration-300 ease-in-out pt-20",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col space-y-6">
          {navLinks.map((link) =>
            !link.dropdown ? (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-lg font-medium relative",
                  isActive(link.href) && "text-primary font-semibold"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  {isActive(link.href) && (
                    <span className="w-1 h-5 bg-primary rounded-full mr-2" />
                  )}
                  {link.name}
                </div>
              </Link>
            ) : (
              <div key={link.name} className="space-y-3">
                <p
                  className={cn(
                    "text-lg font-medium",
                    isActive(link.href) && "text-primary font-semibold"
                  )}
                >
                  {link.name}
                </p>
                <div className="pl-4 border-l-2 border-muted space-y-3">
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "block hover:text-foreground",
                        isActive(item.href)
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}

          <div className="pt-6 border-t border-muted">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {user?.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="block py-2 text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block py-2 text-lg text-red-500"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  className="block w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
