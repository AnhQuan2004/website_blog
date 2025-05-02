import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthRedirect from "./components/auth/AuthRedirect";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import Category from "./pages/Category";
import Categories from "./pages/Categories";
import News from "./pages/News";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import BlogManagement from "./pages/BlogManagement";
import ManagerDashboard from "./pages/ManagerDashboard";
import NotFound from "./pages/NotFound";
import BlogPostEditor from "./pages/BlogPostEditor";
import PracticePrompting from "./pages/PracticePrompting";
import Admin from "./pages/admin";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            {/* Admin routes - no Navbar/Footer */}
            <Route path="/admin/*" element={<AuthRedirect requireAuth requireManager><Admin /></AuthRedirect>} />
            
            {/* Standard blog routes with Navbar/Footer */}
            <Route
              path="*"
              element={
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow pt-16">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<Article />} />
                      <Route path="/article/:slug" element={<Article />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/category/:category" element={<Category />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/practice-prompting" element={<PracticePrompting />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/dashboard" element={<AuthRedirect requireAuth><Dashboard /></AuthRedirect>} />
                      <Route path="/profile" element={<AuthRedirect requireAuth><Profile /></AuthRedirect>} />
                      <Route path="/user-management" element={<AuthRedirect requireAuth requireAdmin><UserManagement /></AuthRedirect>} />
                      <Route path="/blog-management" element={<AuthRedirect requireAuth requireManager><BlogManagement /></AuthRedirect>} />
                      <Route path="/manager-dashboard" element={<AuthRedirect requireAuth requireManager><ManagerDashboard /></AuthRedirect>} />
                      <Route path="/create-post" element={<AuthRedirect requireAuth><BlogPostEditor /></AuthRedirect>} />
                      <Route path="/edit-post/:slug" element={<AuthRedirect requireAuth><BlogPostEditor /></AuthRedirect>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
