import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = "h-6 w-6" }: LoadingSpinnerProps) {
  return (
    <div className="flex h-[200px] items-center justify-center">
      <Loader2 className={`${className} animate-spin`} />
    </div>
  );
}
