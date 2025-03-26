import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getArticles } from "@/utils/api";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/articles/ArticleCard";

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const decodedCategory = category ? decodeURIComponent(category) : "";

  // Fetch articles by category
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles", "category", decodedCategory],
    queryFn: () => getArticles({ category: decodedCategory }),
    enabled: !!decodedCategory,
  });

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 pb-20">
      <div className="content-container">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/articles">
            <ArrowLeft size={16} className="mr-2" />
            Back to all articles
          </Link>
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{decodedCategory}</h1>
          <p className="text-muted-foreground">
            Browse our collection of articles about{" "}
            {decodedCategory.toLowerCase()}.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-secondary h-[360px] rounded-lg"
              ></div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any articles in this category.
            </p>
            <Button asChild>
              <Link to="/articles">Browse all articles</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
