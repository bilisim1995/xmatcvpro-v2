'use client';

import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ExternalLink,
  Info,
  ChevronDown,
  Star,
  Video,
  Bot,
  Camera, // Camera icon is already imported
  Crown,
  Zap,
  Heart,
  Flame,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTopListCategories } from "@/hooks/use-toplist-categories";
import { useTopListSites } from "@/hooks/use-toplist-sites";

const iconMap = { Star, Video, Bot, Camera, Crown, Zap, Heart, Flame, Gift };
const iconList = Object.keys(iconMap) as (keyof typeof iconMap)[]; // Cast to correct type

type CategoryFromAPI = {
  _id: string;
  name: string;
  slug2: string;
  description: string;
  icon_name: string; // This might be a string that needs to be mapped to an icon key
  created_at: Date;
  updated_at: Date;
};

type CategoryWithIcon = CategoryFromAPI & {
  randomIcon: keyof typeof iconMap;
};

export default function TopListPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [categoriesWithIcons, setCategoriesWithIcons] = useState<
    CategoryWithIcon[]
  >([]);

  const { categories, isLoading: isCategoriesLoading } = useTopListCategories();
  const { sites, isLoading: isSitesLoading } = useTopListSites(
    activeCategory === "all"
      ? null
      : categories.find((c) => c.slug2 === activeCategory)?._id || null
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/default-favicon.png"; // This handles broken image links
  };

  const renderLoadingSkeleton = () =>
    [...Array(3)].map((_, index) => (
      <Card
        key={index}
        className="p-4 animate-pulse flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-muted rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-48 bg-muted rounded" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="w-24 h-8 bg-muted rounded" />
          <div className="w-8 h-8 bg-muted rounded" />
        </div>
      </Card>
    ));

  const renderIcon = (iconName?: keyof typeof iconMap) => { // Made iconName optional
    if (!iconName) return null; // Return null if iconName is not provided
    const IconComponent = iconMap[iconName];
    // console.log(`Rendering icon: ${iconName}, Component found: ${!!IconComponent}`); // Log for debugging
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  useEffect(() => {
    if (categories && categories.length > 0) {
      const randomizedCategories = categories.map((category: CategoryFromAPI) => {
        let assignedIcon: keyof typeof iconMap;
        if (category.slug2 === "all") {
          assignedIcon = "Star";
        } else if (category.icon_name && iconList.includes(category.icon_name as keyof typeof iconMap)) {
          assignedIcon = category.icon_name as keyof typeof iconMap;
        } else {
          assignedIcon = iconList[Math.floor(Math.random() * iconList.length)];
        }
        return {
          ...category,
          randomIcon: assignedIcon,
        };
      });
      setCategoriesWithIcons(randomizedCategories);
      // console.log("Processed Categories with Icons:", randomizedCategories); // Log for debugging
    }
  }, [categories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  const handleCardClick = (
    e: React.MouseEvent<HTMLDivElement>,
    siteId: string
  ) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setExpandedCard((prev) => {
      const newExpanded = prev === siteId ? null : siteId;
      if (newExpanded) {
        const cardElement = document.getElementById(`card-${newExpanded}`);
        cardElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return newExpanded;
    });
  };

  const handleVisitSite = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const activeCategDetails: CategoryWithIcon | undefined = useMemo(() => { // Adjusted type
    if (activeCategory === "all") {
        return {
            name: "ALL SITES",
            randomIcon: "Star",
            slug2: "all",
            description: "",
            _id: "all-id", // ensure _id is unique and present
            icon_name: "Star",
            created_at: new Date(),
            updated_at: new Date(),
          };
    }
    return categoriesWithIcons.find((c) => c.slug2 === activeCategory);
  }, [activeCategory, categoriesWithIcons]);

  const filteredCategories = useMemo(() => {
    return categoriesWithIcons.filter(
      (category) =>
        category.slug2 !== "all" &&
        (activeCategory === "all" || category.slug2 === activeCategory) &&
        sites.some((site) => site.category_id === category._id)
    );
  }, [categoriesWithIcons, activeCategory, sites]);

  return (
    <>
      <Head>
        <title>Top Sites List | MyProject</title>
        <meta
          name="description"
          content="Discover the best sites categorized by users. Browse, search and explore!"
        />
      </Head>
      <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-red-50 via-background to-background/95 dark:from-red-950/20 dark:via-background dark:to-background/95">
        <div className="w-full px-2 sm:container sm:mx-auto sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-16">
          {isCategoriesLoading ? (
            <div className="max-w-xl mx-auto mb-8 mt-6 sm:mt-0 space-y-4">
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-[72px]" />
            </div>
          ) : (
            <>
              <div className="max-w-xl mx-2 sm:mx-auto mb-8 mt-6 sm:mt-0">
                <Select
                  value={activeCategory}
                  onValueChange={setActiveCategory}
                >
                  <SelectTrigger className="w-full h-16 shadow-lg hover:shadow-xl transition-shadow">
                    <SelectValue>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 text-lg">
                          {activeCategDetails && renderIcon(activeCategDetails.randomIcon)}
                        </span>
                        <div className="flex-1 font-medium">
                          {activeCategDetails?.name || "Select Category"}
                        </div>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="shadow-lg">
                    <div className="mb-2">
                      <SelectItem
                        value="all"
                        className="py-3 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 text-lg">
                            <Star className="w-5 h-5" />
                          </span>
                          <div className="flex-1 font-medium">ALL SITES</div>
                        </div>
                      </SelectItem>
                    </div>
                    {categoriesWithIcons.map(
                      (category) =>
                        category.slug2 !== "all" && (
                          <div className="mb-2" key={category.slug2}>
                            <SelectItem
                              value={category.slug2}
                              className="py-3 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 text-lg">
                                  {renderIcon(category.randomIcon)}
                                </span>
                                <div className="flex-1 font-medium">
                                  {category.name}
                                </div>
                              </div>
                            </SelectItem>
                          </div>
                        )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-8 relative shadow-sm rounded-lg"
              >
                <ScrollArea className="h-[72px] text-sm text-muted-foreground">
                  {activeCategDetails?.description}
                </ScrollArea>
              </motion.div>
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 overflow-x-auto no-scrollbar whitespace-nowrap sm:whitespace-normal">
            {activeCategory === "all" ? (
              <AnimatePresence>
                {filteredCategories.map((category) => (
                  <div key={category._id} className="mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 text-lg">
                          {renderIcon(category.randomIcon)}
                        </span>
                        {category.name}
                      </h2>
                      <div className="grid gap-4">
                        {sites
                          .filter((site) => site.category_id === category._id)
                          .map((site, index) => (
                            <motion.div
                              key={site._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              <Card
                                id={`card-${site._id}`}
                                className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                                  expandedCard === site._id ? "bg-muted/50" : ""
                                }`}
                                onClick={(e) => handleCardClick(e, site._id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium text-muted-foreground">
                                      #{site.order}
                                    </div>
                                    <div className="w-6 h-6 flex-shrink-0">
                                      {site.favicon_url ? (
                                        <img
                                          src={site.favicon_url}
                                          alt={`${site.title} favicon`}
                                          className="w-full h-full object-contain rounded-full border border-muted/20"
                                          onError={handleImageError}
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                                          <Camera className="w-4 h-4 text-blue-500" /> {/* Changed color for testing */}
                                        </div>
                                      )}
                                    </div>
                                    <div className="font-medium flex flex-col sm:flex-row sm:items-center sm:gap-2 break-words">
                                      <div className="flex items-center gap-1">
                                        {site.title}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-2 transition-transform hover:scale-105"
                                      onClick={() => handleVisitSite(site.url)}
                                    >
                                      Visit Site
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        setExpandedCard((prev) =>
                                          prev === site._id ? null : site._id
                                        )
                                      }
                                    >
                                      <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                          expandedCard === site._id
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    </Button>
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {expandedCard === site._id && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{
                                        duration: 0.4,
                                        ease: "easeInOut",
                                        delay: 0.1,
                                      }}
                                      className="mt-4 pt-4 border-t"
                                    >
                                      <p className="text-sm text-muted-foreground">
                                        {site.description}
                                      </p>
                                      {site.keywords && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {site.keywords
                                            .split(",")
                                            .map((keyword, idx) => (
                                              <span
                                                key={idx}
                                                className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                                              >
                                                {keyword.trim()}
                                              </span>
                                            ))}
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </Card>
                            </motion.div>
                          ))}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </AnimatePresence>
            ) : (
              filteredCategories.map((category) => (
                <div key={category._id} className="mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 text-lg">
                        {renderIcon(category.randomIcon)}
                      </span>
                      {category.name}
                    </h2>
                    <div className="space-y-2">
                      {isSitesLoading ? (
                        renderLoadingSkeleton()
                      ) : (
                        <AnimatePresence>
                          {sites
                            .filter((site) => site.category_id === category._id)
                            .map((site, index) => (
                              <motion.div
                                key={site._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card
                                  id={`card-${site._id}`}
                                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                                    expandedCard === site._id
                                      ? "bg-muted/50"
                                      : ""
                                  }`}
                                  onClick={(e) => handleCardClick(e, site._id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="text-sm font-medium text-muted-foreground">
                                        #{site.order}
                                      </div>
                                      <div className="w-6 h-6 flex-shrink-0">
                                        {site.favicon_url ? (
                                          <img
                                            src={site.favicon_url}
                                            alt={`${site.title} favicon`}
                                            className="w-full h-full object-contain rounded-full border border-muted/20"
                                            onError={handleImageError}
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                                            <Camera className="w-4 h-4 text-blue-500" /> {/* Changed color for testing */}
                                          </div>
                                        )}
                                      </div>
                                      <div className="font-medium flex items-center gap-2 break-words">
                                        {site.title}
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                              >
                                                <Info className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{site.description}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 transition-transform hover:scale-105"
                                        onClick={() =>
                                          handleVisitSite(site.url)
                                        }
                                      >
                                        Visit Site
                                        <ExternalLink className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <ChevronDown
                                          className={`w-4 h-4 transition-transform duration-200 ${
                                            expandedCard === site._id
                                              ? "rotate-180"
                                              : ""
                                          }`}
                                        />
                                      </Button>
                                    </div>
                                  </div>

                                  <AnimatePresence>
                                    {expandedCard === site._id && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{
                                          duration: 0.4,
                                          ease: "easeInOut",
                                          delay: 0.1,
                                        }}
                                        className="mt-4 pt-4 border-t"
                                      >
                                        <p className="text-sm text-muted-foreground">
                                          {site.description}
                                        </p>
                                        {site.keywords && (
                                          <div className="mt-2 flex flex-wrap gap-2">
                                            {site.keywords
                                              .split(",")
                                              .map((keyword, idx) => (
                                                <span
                                                  key={idx}
                                                  className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                                                >
                                                  {keyword.trim()}
                                                </span>
                                              ))}
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </Card>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
