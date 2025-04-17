"use client";

import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CraigslistListing } from "@/lib/types";
import Image from "next/image";

interface ListingCardProps {
  listing: CraigslistListing;
  isNew?: boolean;
}

export function ListingCard({ listing, isNew }: ListingCardProps) {
  const formattedPrice = listing.price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(parseFloat(listing.price.replace(/[^0-9.-]+/g, "")))
    : "Price not listed";

  const formattedDate = formatDistanceToNow(new Date(listing.datetime), {
    addSuffix: true,
  });

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        {listing.thumbnail ? (
          <Image
            src={listing.thumbnail}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}
        {isNew && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 bg-primary text-primary-foreground"
          >
            New
          </Badge>
        )}
      </div>
      <CardContent className="space-y-2 p-4">
        <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formattedPrice}
          </span>
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>
        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {listing.description}
          </p>
        )}
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{listing.category}</Badge>
          <Badge variant="outline">{listing.location}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => window.open(listing.url, "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Craigslist
        </Button>
      </CardFooter>
    </Card>
  );
}
