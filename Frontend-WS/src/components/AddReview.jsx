import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "../hooks/use-toast";
import { FaStar } from "react-icons/fa";

const AddReview = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const { toast } = useToast();

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = () => {
    if (rating > 0 && comment.trim()) {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);

      if (images.length > 0) {
        // Append images to FormData
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      // Call the onSubmit function to handle the form data
      onSubmit(formData);

      toast({
        title: "Review Submitted",
        description: "Your review has been successfully submitted.",
        variant: "success",
      });

      setRating(0);
      setComment("");
      setImages([]);
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Please provide both a rating and a comment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Your Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  id="rating"
                  name="rating"
                  className={`text-2xl cursor-pointer ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <Textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1"
              name="comment"
              id="comment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Images (Optional)
            </label>
            <Input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReview;
