import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback loading component with skeleton
const LoadingFallback = () => {
  return (
    <div className="min-h-screen bg-rose-50 p-6 flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Avatar skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-24 w-24 rounded-full bg-rose-100" />
        </div>
        {/* Form fields skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-full bg-rose-100" />
          <Skeleton className="h-10 w-full bg-rose-100" />
          <Skeleton className="h-20 w-full bg-rose-100" />
        </div>
        {/* Button skeleton */}
        <div className="flex justify-end space-x-4">
          <Skeleton className="h-10 w-24 bg-rose-200" />
          <Skeleton className="h-10 w-24 bg-rose-200" />
        </div>
      </div>
    </div>
  );
};

// Layout component must accept `children`
export default function EditProfileLayout({ children }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-rose-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          {children}
        </div>
      </div>
    </Suspense>
  );
}
