import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  articleId: {
    type: String,
    required: [true, 'Article ID is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true
  },
  authorId: {
    type: String,
    required: [true, 'Author ID is required']
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required']
  },
  authorAvatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema); 