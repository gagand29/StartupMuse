import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Idea } from "@shared/schema";

// Lazy load the map component to improve initial load time
const IdeaMap = lazy(() => import("@/components/IdeaMap"));

interface IdeaResultProps {
  idea: Idea;
  onSave: () => void;
}

export default function IdeaResult({ idea, onSave }: IdeaResultProps) {
  const { toast } = useToast();
  
  const { mutate: saveIdea, isPending } = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/save", idea);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Idea saved successfully!",
      });
      onSave();
    },
    onError: (error) => {
      toast({
        title: "Error saving idea",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Animation variants for features list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <Card className="overflow-hidden border-2 border-border bg-card shadow-lg">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Your Startup Idea</CardTitle>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => saveIdea()}
              className="bg-gradient-to-r from-secondary to-secondary/90 hover:opacity-90 text-white font-medium rounded-xl flex items-center"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Save Idea
                </>
              )}
            </Button>
          </motion.div>
        </div>
        <Badge className="mt-2 self-start bg-primary/20 text-primary hover:bg-primary/30">{idea.topic}</Badge>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="mb-2 text-base font-medium text-muted-foreground">Startup Name</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{idea.name}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="mb-2 text-base font-medium text-muted-foreground">Description</h3>
            <p className="text-foreground leading-relaxed">
              {idea.description}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="mb-3 text-base font-medium text-muted-foreground">Key Features</h3>
            <motion.ul 
              className="space-y-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {idea.features.map((feature, index) => (
                <motion.li key={index} variants={item} className="flex items-start">
                  <span className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <i className="fas fa-check text-xs"></i>
                  </span>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Headquarters Location */}
          {(idea.city || idea.latitude || idea.longitude) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="pt-2"
            >
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium text-muted-foreground flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-secondary"></i>
                    Global Headquarters
                  </h3>
                  {idea.city && (
                    <Badge 
                      variant="outline" 
                      className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 flex items-center gap-1"
                    >
                      <i className="fas fa-globe-americas text-xs"></i>
                      {idea.city}
                    </Badge>
                  )}
                </div>
                
                {idea.locationRationale && (
                  <div className="text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                    "{idea.locationRationale}"
                  </div>
                )}
              </div>
              
              <motion.div 
                className="rounded-lg overflow-hidden border-2 border-border shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
              >
                <Suspense fallback={
                  <div className="bg-muted/20 flex items-center justify-center" style={{ height: '300px' }}>
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Locating headquarters...</p>
                    </div>
                  </div>
                }>
                  <IdeaMap idea={idea} />
                </Suspense>
                
                {(idea.latitude && idea.longitude) && (
                  <div className="bg-muted/30 text-xs text-muted-foreground p-2 flex justify-between">
                    <span>
                      <i className="fas fa-map-pin mr-1"></i> {idea.city || 'Headquarters Location'}
                    </span>
                    <span className="font-mono text-xs">
                      {parseFloat(idea.latitude).toFixed(4)}, {parseFloat(idea.longitude).toFixed(4)}
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
