import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Bot, Newspaper } from "lucide-react";
import { getArticles } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ArticleCard from "@/components/articles/ArticleCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch all articles
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles(),
  });

  // Filter articles based on search term
  const filteredArticles = articles.filter((article) => {
    return (
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArticles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 pb-20">
      <div className="content-container">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest News</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest technology news and updates from
            around the world.
          </p>
        </div>

        <Alert className="mb-8 border-purple-300 bg-purple-50 dark:bg-purple-950/30 dark:border-purple-800">
          <Bot className="h-5 w-5 text-purple-500" />
          <AlertTitle className="text-purple-700 dark:text-purple-300">
            Automated Content
          </AlertTitle>
          <AlertDescription className="text-purple-600 dark:text-purple-400">
            This content is automated by our AI agent - crawled, written, and
            posted without human intervention.
          </AlertDescription>
        </Alert>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Input
            placeholder="Search news..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>

        <Separator className="my-8" />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-secondary h-[360px] rounded-lg"
              ></div>
            ))}
          </div>
        ) : currentItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                        />
                      </PaginationItem>
                    )}

                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={currentPage === index + 1}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Newspaper className="text-muted-foreground" size={24} />
            </div>
            <h3 className="text-xl font-medium mb-2">No news found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search to find what you're looking for.
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                }}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
