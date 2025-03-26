import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Link } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import FeaturedArticle from "@/components/articles/FeaturedArticle";
import ArticleCard from "@/components/articles/ArticleCard";
import BlurImage from "@/components/ui/BlurImage";
import { getArticles } from "@/utils/api";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Fetch featured articles
  const { data: featuredArticles, isLoading: featuredLoading } = useQuery({
    queryKey: ["articles", "featured"],
    queryFn: () => getArticles({ featured: true }),
  });

  // Fetch latest articles
  const { data: latestArticles, isLoading: latestLoading } = useQuery({
    queryKey: ["articles", "latest"],
    queryFn: () => getArticles({ limit: 6 }),
  });

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Handle Get Started button click
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  // Handle Explore Topics button click
  const handleExploreTopics = () => {
    navigate("/categories");
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-background to-secondary/30">
        <div className="content-container text-center relative z-10">
          <div className="animate-slide-in-bottom max-w-3xl mx-auto space-y-6">
            <h1 className="text-title">Discover the Future of Technology</h1>
            <p className="text-subtitle text-muted-foreground">
              Insightful articles, tutorials, and analyses on the latest trends
              in technology, programming, AI, and digital innovation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="animate-fade-in"
                style={{ animationDelay: "200ms" }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="animate-fade-in" 
                style={{ animationDelay: '400ms' }}
                onClick={handleExploreTopics}
              >
                Explore Topics
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 opacity-25">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
      </section>

      {/* Featured Article Section */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-semibold">Featured Article</h2>
          </div>

          {featuredLoading ? (
            <div className="h-[400px] glass-card rounded-xl animate-pulse"></div>
          ) : (
            featuredArticles &&
            featuredArticles.length > 0 && (
              <FeaturedArticle article={featuredArticles[0]} />
            )
          )}
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 md:py-20">
        <div className="content-container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-semibold">Latest Articles</h2>
            <Link
              to="/articles"
              className="group flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              View all articles
              <ArrowRight
                size={16}
                className="ml-1 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {latestLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[360px] bg-muted rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles?.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
              Stay Updated
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-4">
              Subscribe to our newsletter
            </h2>
            <p className="text-muted-foreground mb-8 md:text-lg">
              Get the latest articles, tutorials, and updates delivered straight
              to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                required
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Explore Topics
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto md:text-lg">
              Dive deep into your favorite technology subjects with our curated
              content categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Artificial Intelligence",
                description:
                  "Machine learning, deep learning, neural networks, and AI applications",
                image:
                  "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                href: "/category/artificial-intelligence",
              },
              {
                title: "Web Development",
                description:
                  "Frontend, backend, full-stack development, and modern web technologies",
                image:
                  "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                href: "/category/web-development",
              },
              {
                title: "Cybersecurity",
                description:
                  "Security best practices, vulnerabilities, encryption, and privacy",
                image:
                  "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                href: "/category/cybersecurity",
              },
              {
                title: "Quantum Computing",
                description:
                  "Quantum theory, qubits, quantum algorithms, and future applications",
                image:
                  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                href: "/category/quantum-computing",
              },
            ].map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className="group relative overflow-hidden rounded-xl aspect-[4/3] hover-lift"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                <BlurImage
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
