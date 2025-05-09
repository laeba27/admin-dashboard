import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "../../lib/utils";
import { BadgeCheck, Clock } from "lucide-react";

export function RecentInventoryList({ items = [] }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <p className="text-sm text-muted-foreground">No recent items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Link 
          key={item.id}
          href={`/dashboard/inventory/${item.id}`}
          className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/10 transition-colors"
        >
          <div className="relative overflow-hidden rounded-md h-12 w-12 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium leading-none truncate">
                {item.name}
              </h4>
              {item.status === "In Stock" && (
                <BadgeCheck className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={cn(
                "inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium",
                item.status === "In Stock" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                  : item.status === "Low Stock"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              )}>
                {item.status}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="font-medium text-sm">${item.price}</div>
        </Link>
      ))}
    </div>
  );
}