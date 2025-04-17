import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
    </div>
  );
}
