import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import IdeaForm from "@/components/IdeaForm";
import IdeaResult from "@/components/IdeaResult";
import SavedIdeas from "@/components/SavedIdeas";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Idea } from "@shared/schema";

export default function Home() {
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  
  const { 
    data: savedIdeas, 
    isLoading: isLoadingIdeas,
    refetch: refetchIdeas 
  } = useQuery<Idea[]>({
    queryKey: ['/api/ideas'],
  });
  
  // Fetch saved ideas on initial load
  useEffect(() => {
    refetchIdeas();
  }, [refetchIdeas]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Header */}
      <motion.header 
        className="bg-card shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold flex items-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <i className="fas fa-lightbulb mr-3 text-yellow-400"></i>
            Startup Idea Generator
          </motion.h1>
          <motion.div 
            className="flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              
            </span>
            <ThemeToggle />
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <IdeaForm setCurrentIdea={setCurrentIdea} />
          </motion.div>
          
          {currentIdea && (
            <motion.div 
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <IdeaResult 
                idea={currentIdea} 
                onSave={() => refetchIdeas()} 
              />
            </motion.div>
          )}
          
          <motion.div variants={itemVariants}>
            <SavedIdeas
              ideas={Array.isArray(savedIdeas) ? savedIdeas : []}
              isLoading={isLoadingIdeas}
            />
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="bg-card border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} Startup Idea Generator. All rights reserved.</p>
            <div className="mt-2 md:mt-0 flex space-x-6">
              <a href="#" className="hover:text-primary transition-colors duration-200">About</a>
              <a href="#" className="hover:text-primary transition-colors duration-200">API</a>
              <a href="#" className="hover:text-primary transition-colors duration-200">Contact</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
