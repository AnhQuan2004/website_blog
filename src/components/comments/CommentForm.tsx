import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { createComment } from "@/utils/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const formSchema = z.object({
  content: z.string().min(2, "Comment must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface CommentFormProps {
  articleId: string;
  parentId?: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  articleId,
  parentId,
  onCommentAdded,
}) => {
  const { user, isAuthenticated } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to comment");
      return;
    }

    try {
      await createComment({
        content: values.content,
        articleId,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        parentId,
      });

      form.reset();
      onCommentAdded();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-6 mb-6 bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          Please log in to join the conversation.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Leave a comment</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts..."
                    className="min-h-[120px] resize-none bg-background focus:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              Post Comment
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default CommentForm;
