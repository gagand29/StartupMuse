import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Idea } from "@shared/schema";
import IdeaMap from "./IdeaMap";

interface IdeaResultProps {
  idea: Idea;
  onSave: () => void;
}

export default function IdeaResult({ idea, onSave }: IdeaResultProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(idea),
      });

      if (!response.ok) {
        throw new Error('Failed to save idea');
      }

      onSave();
    } catch (error) {
      console.error('Error saving idea:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <motion.h2 
                className="text-2xl font-bold text-primary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {idea.name}
              </motion.h2>
              <Badge variant="outline" className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20">
                {idea.topic}
              </Badge>
            </div>
            <p className="text-foreground text-sm">{idea.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Key Features:</p>
            <ul className="grid gap-2">
              {idea.features.map((feature, index) => (
                <motion.li 
                  key={index}
                  className="text-sm text-foreground flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="mr-2 text-xs text-primary">
                    <i className="fas fa-check-circle"></i>
                  </span>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>

          {idea.latitude && idea.longitude && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[200px] rounded-md overflow-hidden"
            >
              <IdeaMap idea={idea} />
            </motion.div>
          )}

          <div className="flex justify-end">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Idea'}
              </Button>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}