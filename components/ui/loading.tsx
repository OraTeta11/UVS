import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary";
  className?: string;
  text?: string;
}

export function Loading({ size = "md", variant = "default", className, text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const variantClasses = {
    default: "text-gray-500",
    primary: "text-primary",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className={cn("text-sm", variantClasses[variant])}>
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loading size="lg" text="Loading..." />
    </div>
  );
} 