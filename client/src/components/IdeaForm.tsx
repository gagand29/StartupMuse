import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Idea } from "@shared/schema";

interface IdeaFormProps {
  setCurrentIdea: (idea: Idea | null) => void;
}

export default function IdeaForm({ setCurrentIdea }: IdeaFormProps) {
  const [topic, setTopic] = useState("");
  const { toast } = useToast();

  const { mutate: generateIdea, isPending } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate", { topic });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentIdea(data);
    },
    onError: (error) => {
      toast({
        title: "Error generating idea",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }
    
    generateIdea();
  };

  return (
    <Card className="overflow-hidden border-2 border-border bg-card shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-6">
        <CardTitle className="text-2xl font-bold">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mr-3 text-primary"
              initial={{ rotate: -45, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <i className="fas fa-lightbulb text-2xl"></i>
            </motion.div>
            Generate Your Startup Idea
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <Label htmlFor="topic" className="mb-2 block text-sm font-medium">
              Enter a topic (e.g., fitness, education, finance)
            </Label>
            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-12 w-full rounded-xl border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your topic here"
                disabled={isPending}
                required
              />
            </motion.div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              type="submit"
              className="h-12 w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium rounded-xl flex items-center justify-center"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="mr-2 animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-bolt mr-2"></i>
                  Generate Idea
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
