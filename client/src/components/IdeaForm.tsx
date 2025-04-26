import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Generate Your Startup Idea</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Enter a topic (e.g., fitness, education, finance)
            </Label>
            <Input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Enter your topic here"
              disabled={isPending}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition flex items-center justify-center"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-bolt mr-2"></i>
                Generate Idea
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
