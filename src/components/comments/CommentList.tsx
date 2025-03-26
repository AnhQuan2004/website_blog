import React from "react";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, Comment, deleteComment } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface CommentListProps {
  comments: Comment[];
  onCommentDeleted: () => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onCommentDeleted,
}) => {
  const { user } = useAuth();

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      onCommentDeleted();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <Card key={comment.id} className="p-6 border rounded-lg">
          <div className="flex space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={comment.authorAvatar}
                alt={comment.authorName}
              />
              <AvatarFallback>
                {comment.authorName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{comment.authorName}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-gray-800 dark:text-gray-200">
                {comment.content}
              </p>
              <div className="mt-3 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground text-xs flex items-center gap-1"
                >
                  <MessageCircle size={14} />
                  Reply
                </Button>
                {user && user.id === comment.authorId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="h-auto p-0 text-muted-foreground text-xs hover:text-destructive"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommentList;
