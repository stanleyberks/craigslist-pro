import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";

export function NoResults() {
  const router = useRouter();

  return (
    <EmptyState
      icon={<Search className="h-10 w-10 text-muted-foreground" />}
      title="No Results Found"
      description="Create alerts to start receiving Craigslist matches that interest you."
      action={{
        label: "Create Your First Alert",
        onClick: () => router.push("/app/alerts/new"),
      }}
    />
  );
}
