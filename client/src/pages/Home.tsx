import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import IdeaForm from "@/components/IdeaForm";
import IdeaResult from "@/components/IdeaResult";
import SavedIdeas from "@/components/SavedIdeas";
import { Idea } from "@shared/schema";

export default function Home() {
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  
  const { 
    data: savedIdeas, 
    isLoading: isLoadingIdeas,
    refetch: refetchIdeas 
  } = useQuery({
    queryKey: ['/api/ideas'],
  });
  
  // Fetch saved ideas on initial load
  useEffect(() => {
    refetchIdeas();
  }, [refetchIdeas]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
            Startup Idea Generator
          </h1>
          <div className="text-sm text-gray-500">Powered by OpenAI</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <IdeaForm setCurrentIdea={setCurrentIdea} />
          
          {currentIdea && (
            <IdeaResult 
              idea={currentIdea} 
              onSave={() => refetchIdeas()} 
            />
          )}
          
          <SavedIdeas
            ideas={savedIdeas || []}
            isLoading={isLoadingIdeas}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Startup Idea Generator. All rights reserved.</p>
            <div className="mt-2 md:mt-0 flex space-x-4">
              <a href="#" className="hover:text-gray-700 transition">About</a>
              <a href="#" className="hover:text-gray-700 transition">API</a>
              <a href="#" className="hover:text-gray-700 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
