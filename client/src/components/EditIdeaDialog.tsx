import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Idea } from "@shared/schema";

interface EditIdeaDialogProps {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function EditIdeaDialog({ idea, isOpen, onClose, onSave }: EditIdeaDialogProps) {
  const [formData, setFormData] = useState({
    name: idea.name,
    description: idea.description,
    features: [...idea.features],
    topic: idea.topic,
    city: idea.city || null,
    latitude: idea.latitude || null,
    longitude: idea.longitude || null,
  });
  
  const { toast } = useToast();

  const { mutate: updateIdea, isPending } = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", `/api/ideas/${idea.id}`, formData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Idea updated successfully!",
      });
      onSave();
    },
    onError: (error) => {
      toast({
        title: "Error updating idea",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || formData.features.some(f => !f.trim())) {
      toast({
        title: "Error",
        description: "All fields are required and cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    updateIdea();
  };

  const inputVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden bg-card border-2 border-border">
        <DialogHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4 -mx-6 px-6 -mt-6 pt-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Edit Startup Idea
          </DialogTitle>
          <DialogDescription>
            Make changes to your startup idea below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <motion.div 
              className="grid gap-2"
              variants={inputVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.2 }}
            >
              <Label htmlFor="topic" className="text-muted-foreground">Topic</Label>
              <Input
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="h-10 rounded-md border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </motion.div>
            
            <motion.div 
              className="grid gap-2"
              variants={inputVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Label htmlFor="name" className="text-muted-foreground">Startup Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="h-10 rounded-md border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </motion.div>
            
            <motion.div 
              className="grid gap-2"
              variants={inputVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Label htmlFor="description" className="text-muted-foreground">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="rounded-md border-border focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                required
              />
            </motion.div>
            
            <motion.div 
              className="grid gap-3"
              variants={inputVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <Label className="text-muted-foreground">Key Features</Label>
              {formData.features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                    {index + 1}
                  </span>
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="h-10 rounded-md border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Location information */}
            <motion.div 
              className="grid gap-3 mt-2 border-t border-border pt-4"
              variants={inputVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.2, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-secondary"></i>
                <Label className="text-muted-foreground font-medium">Headquarters Location</Label>
              </div>
              
              <div className="grid gap-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="city" className="text-muted-foreground text-sm mb-1 block">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    placeholder="Enter city name"
                    className="h-10 rounded-md border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <Label htmlFor="latitude" className="text-muted-foreground text-sm mb-1 block">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      value={formData.latitude || ''}
                      onChange={handleInputChange}
                      placeholder="Enter latitude"
                      className="h-10 rounded-md border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label htmlFor="longitude" className="text-muted-foreground text-sm mb-1 block">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      value={formData.longitude || ''}
                      onChange={handleInputChange}
                      placeholder="Enter longitude"
                      className="h-10 rounded-md border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <DialogFooter className="mt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-gradient-to-r from-primary to-secondary text-white"
              >
                {isPending ? (
                  <>
                    <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </>
                )}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}