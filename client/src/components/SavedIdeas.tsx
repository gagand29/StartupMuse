import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Idea } from "@shared/schema";
import EditIdeaDialog from "@/components/EditIdeaDialog";

interface SavedIdeasProps {
  ideas: Idea[];
  isLoading: boolean;
}

export default function SavedIdeas({ ideas, isLoading }: SavedIdeasProps) {
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: deleteIdea, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/ideas/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Idea deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ideas'] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting idea",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setIsEditDialogOpen(true);
  };

  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteIdea(deleteId);
      setDeleteId(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
    <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
      <AlertDialogContent className="bg-card/95 border-2 border-border shadow-xl backdrop-blur-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Delete Idea</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete this idea? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="border-2 border-border hover:bg-muted/50">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Card className="overflow-hidden border-2 border-border bg-card shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <CardTitle className="text-2xl font-bold flex items-center">
          <motion.div
            className="mr-3 text-secondary"
            initial={{ rotate: -45, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <i className="fas fa-bookmark text-xl"></i>
          </motion.div>
          Saved Ideas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <motion.div 
              className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <i className="fas fa-spinner text-primary"></i>
            </motion.div>
            <p className="mt-4 text-muted-foreground">Loading saved ideas...</p>
          </div>
        ) : ideas.length === 0 ? (
          <motion.div 
            className="rounded-lg bg-muted/50 p-8 text-center flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <i className="fas fa-folder-open text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">No saved ideas yet</h3>
            <p className="text-muted-foreground">Generate and save some ideas to see them here.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4 mt-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {ideas.map((idea) => (
                <motion.div 
                  key={idea.id} 
                  className="border-2 border-border rounded-lg p-5 hover:shadow-md transition-shadow bg-card overflow-hidden"
                  variants={itemVariants}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{idea.name}</h3>
                      <Badge variant="outline" className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20">{idea.topic}</Badge>
                    </div>
                    <p className="text-foreground text-sm">{idea.description}</p>
                    
                    {idea.city && (
                      <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                        <i className="fas fa-map-marker-alt text-secondary/70"></i>
                        <span>{idea.city}</span>
                      </div>
                    )}
                    
                    <div className="mt-1">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Key Features:</p>
                      <ul className="grid gap-1">
                        {idea.features.map((feature, index) => (
                          <li key={index} className="text-sm text-foreground flex items-center">
                            <span className="mr-2 text-xs text-primary">
                              <i className="fas fa-check-circle"></i>
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2 flex space-x-3 justify-end">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => handleEdit(idea)} 
                          variant="outline"
                          size="sm"
                          className="text-xs border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          <i className="fas fa-edit mr-1.5"></i> Edit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={() => handleDelete(idea.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                          disabled={isDeleting}
                        >
                          <i className="fas fa-trash-alt mr-1.5"></i> Delete
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
      
      {editingIdea && (
        <EditIdeaDialog
          idea={editingIdea}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingIdea(null);
          }}
          onSave={() => {
            setIsEditDialogOpen(false);
            setEditingIdea(null);
            queryClient.invalidateQueries({ queryKey: ['/api/ideas'] });
          }}
        />
      )}
    </Card>
  );
}
