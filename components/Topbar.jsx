"use client";
import React, { useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPen, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/store/useSearchStore";

const Topbar = () => {
  const { uid, email, image, setUser, clearUser } = useUserStore();
  const { clearStorage } = useSearchStore();
  const [loggin, setloggin] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State to control Sheet
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setloggin(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        }),
      });

      const res = await fetch(`/api/users?email=${user.email}`);
      const data = await res.json();

      if (data.success) {
        setUser({
          id: data.user._id,
          uid: data.user.uid,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          image: data.user.image,
        });
      }
      setloggin(false);
      setIsSheetOpen(false); // Close Sheet after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearStorage();
      clearUser();
      router.push("/");
      setIsSheetOpen(false); // Close Sheet after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed left-0 top-0 z-10 w-full">
      <nav className="bg-white/80 backdrop-blur-md border-b border-rose-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <Link href={"/"}>
                <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  HostelFinder
                </span>
              </Link>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-8">
              {uid ? (
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={image} />
                    <AvatarFallback>
                      {email ? email[0].toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <Link href={`/Editprofile`}>
                    <UserPen
                      size={22}
                      className="hover:text-rose-500 hover:scale-125 transition-transform duration-200"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-full hover:from-gray-600 hover:to-gray-800 transition-all transform hover:scale-105"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-full hover:from-rose-600 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  {loggin ? "Please wait..." : "Sign In with Google"}
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-gray-100">
                    <Menu className="hover:text-rose-500" size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>

                  {uid ? (
                    <div className="flex flex-col items-center mt-6 space-y-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={image || "/default-avatar.png"} />
                        <AvatarFallback>
                          {email ? email[0].toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{email}</p>
                      <button
                        onClick={() => setIsSheetOpen(false)} // Close Sheet on click
                        className="flex items-center gap-2 text-gray-700 hover:text-rose-600"
                      >
                        <Link href={`/Editprofile`}>
                          <UserPen
                            size={22}
                            className="hover:text-rose-500 hover:scale-125 transition-transform duration-200"
                          />
                        </Link>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-full hover:from-gray-600 hover:to-gray-800 transition-all"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center mt-6 space-y-4">
                      <button
                        onClick={handleLogin}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-full hover:from-rose-600 hover:to-pink-700 transition-all"
                      >
                        {loggin ? "Please wait..." : "Sign In with Google"}
                      </button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Topbar;
