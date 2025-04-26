import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      deleteIdea(id);
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Saved Ideas</h2>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-gray-300 border-t-primary"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading saved ideas...</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
            <i className="fas fa-folder-open text-gray-400 text-2xl mb-2"></i>
            <p>No saved ideas yet. Generate and save some ideas to see them here.</p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {ideas.map((idea) => (
              <div key={idea.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-primary">{idea.name}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{idea.topic}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{idea.description}</p>
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-500">Key Features:</p>
                  <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
                    {idea.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3 flex space-x-2 justify-end">
                  <Button
                    onClick={() => handleEdit(idea)} 
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <i className="fas fa-edit mr-1"></i> Edit
                  </Button>
                  <Button 
                    onClick={() => handleDelete(idea.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    <i className="fas fa-trash-alt mr-1"></i> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
