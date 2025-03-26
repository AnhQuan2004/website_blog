import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { getArticles } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryInfo {
  name: string;
  count: number;
  description: string;
}

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all articles to extract categories
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles(),
  });

  // Extract unique categories and count articles in each
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, number>();

    articles.forEach((article) => {
      const count = categoryMap.get(article.category) || 0;
      categoryMap.set(article.category, count + 1);
    });

    // Add descriptions for each category
    const categoryInfos: CategoryInfo[] = Array.from(categoryMap.entries()).map(
      ([name, count]) => ({
        name,
        count,
        description: getCategoryDescription(name),
      })
    );

    return categoryInfos.sort((a, b) => a.name.localeCompare(b.name));
  }, [articles]);

  // Filter categories based on search query
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  // Function to get category descriptions
  const getCategoryDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
      "Web Development":
        "Articles about web technologies, frameworks, and best practices",
      "Artificial Intelligence":
        "Exploring AI, machine learning, and neural networks",
      Cybersecurity: "Security threats, defenses, and industry best practices",
      "Data Science": "Data analysis, visualization, and statistical modeling",
      "Mobile Development": "iOS, Android, and cross-platform app development",
      DevOps: "Continuous integration, deployment, and infrastructure as code",
      Programming: "Programming languages, algorithms, and software design",
      Design: "UI/UX design principles and tools",
      Career: "Career advice, interviews, and industry insights",
    };

    return (
      descriptions[category] || `Articles related to ${category.toLowerCase()}`
    );
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 pb-20">
      <div className="content-container">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Categories</h1>
          <p className="text-muted-foreground">
            Browse articles by topic or search for specific categories.
          </p>
        </div>

        <div className="relative mb-8">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Search categories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-secondary h-[180px] rounded-lg"
              ></div>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${encodeURIComponent(category.name)}`}
                className="block transition-transform hover:-translate-y-1"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>
                      {category.count} article{category.count !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any categories matching your search.
            </p>
            <Button onClick={() => setSearchQuery("")}>
              Show all categories
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
