import Link from "next/link";
import { CloudLightning, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-x-3 hover:opacity-80 transition-opacity"
          >
            {/* Logo Image */}
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-p8wYqydbp5hEU4Iquhbhub3HeIsmWHKNUg&s"
              alt="Vitb"
              className="h-10 w-10 rounded-full object-cover"
            />
            {/* Logo Text */}
            <div className="leading-tight">
              <h1 className="text-lg font-bold text-gray-900">GCP Cohort 2</h1>
              <p className="text-sm text-gray-600">Lab Solutions</p>
            </div>
          </Link>

          {/* Submit Button */}
          <Link href="/submit">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
              <Plus className="h-4 w-4" />
              Submit Solution
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
