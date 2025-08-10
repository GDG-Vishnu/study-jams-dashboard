"use client";
import Link from "next/link";
import { Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/report", label: "Daily Report" },
    { href: "https://garcade.in/calculator", label: "Arcade Calculator", external: true },
    { href: "/submit", label: "Submit Solution", cta: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-x-3 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-p8wYqydbp5hEU4Iquhbhub3HeIsmWHKNUg&s"
              alt="VITB"
              className="h-10 w-10 object-contain"
              width={40}
              height={40}
            />
            <div className="leading-tight">
              <h1 className="text-lg font-semibold text-gray-900">Google Arcade Cohort 2</h1>
              <p className="text-xs text-gray-500">Vishnu Institute of Technology</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                passHref
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.cta ? (
                  <Button
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${isActive(link.href) ? 'ring-2 ring-blue-800' : ''}`}
                  >
                    <Plus className="h-4 w-4" />
                    {link.label}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className={`text-gray-700 hover:text-blue-600 hover:bg-blue-50 ${isActive(link.href) ? 'font-medium text-blue-600 bg-blue-50' : ''}`}
                  >
                    {link.label}
                  </Button>
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col gap-2 mt-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      passHref
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.cta ? (
                        <Button
                          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center gap-2 ${isActive(link.href) ? 'ring-2 ring-blue-800' : ''}`}
                        >
                          <Plus className="h-4 w-4" />
                          {link.label}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 ${isActive(link.href) ? 'font-medium text-blue-600 bg-blue-50' : ''}`}
                        >
                          {link.label}
                        </Button>
                      )}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}