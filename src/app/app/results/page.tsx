"use client";

import * as React from "react";
import { ResultsList } from "@/components/app/results/results-list";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function ResultsPage() {
  return (
    <DashboardLayout
      sidebar={
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Refine your search results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Sort By</Label>
                  <Select defaultValue="newest">
                    <SelectTrigger>
                      <SelectValue placeholder="Select sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Show Only</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="unread" />
                      <label
                        htmlFor="unread"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Unread matches
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="has-image" />
                      <label
                        htmlFor="has-image"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Has images
                      </label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Price Range</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-100">Under $100</SelectItem>
                      <SelectItem value="100-500">$100 - $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                      <SelectItem value="over-1000">Over $1,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      }
    >
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Results</h1>
              <p className="text-muted-foreground">
                View and filter your Craigslist matches
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <Card>
            <CardContent className="p-6">
              <ResultsList />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
}
