import { Card, CardContent } from "@/components/ui/card";
import { Idea } from "@shared/schema";

interface SavedIdeasProps {
  ideas: Idea[];
  isLoading: boolean;
}

export default function SavedIdeas({ ideas, isLoading }: SavedIdeasProps) {
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
