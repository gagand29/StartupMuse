import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Idea } from "@shared/schema";

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

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Your Startup Idea</h2>
          <Button
            onClick={() => saveIdea()}
            className="bg-secondary hover:bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded-md transition flex items-center"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="mr-1.5 animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-1.5"></i>
                Save Idea
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-700">Startup Name</h3>
            <p className="text-lg font-medium text-primary mt-1">{idea.name}</p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-700">Description</h3>
            <p className="mt-1 text-gray-600">
              {idea.description}
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-700">Key Features</h3>
            <ul className="mt-1 space-y-1 list-disc list-inside text-gray-600">
              {idea.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
