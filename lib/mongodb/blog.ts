import mongoose from 'mongoose';
import { formatDate } from '@/lib/utils';

export interface BlogPost {
  _id: string;
  title: string;
  keywords: string;
  category: string;
  publish_date: Date;
  content_raw: string;
  content: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  formatted_date?: string;
}

const blogSchema = new mongoose.Schema<BlogPost>({
  title: { type: String, required: true },
  keywords: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Genel', 'Teknoloji', 'AI', 'Updates']
  },
  publish_date: { type: Date, required: true },
  content_raw: { type: String, required: true },
  content: { type: String, required: true },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Virtual for formatted date
blogSchema.virtual('formatted_date').get(function() {
  return formatDate(this.publish_date);
});

// Ensure virtuals are included in JSON
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure slug uniqueness and format
blogSchema.pre('save', async function(next) {
  if (this.isModified('title') && !this.slug) {
    let slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check slug uniqueness
    let counter = 0;
    let uniqueSlug = slug;
    while (await mongoose.models.Blog.findOne({ slug: uniqueSlug })) {
      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }
    this.slug = uniqueSlug;
  }
  next();
});

// Add error handling middleware
blogSchema.post('save', function(error: any, doc: any, next: any) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('A blog post with this slug already exists'));
  } else {
    next(error);
  }
});

// Compound indexes for efficient querying
blogSchema.index({ category: 1, publish_date: -1 });
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ keywords: 'text', title: 'text' });
blogSchema.index({ created_at: -1 });

export const BlogModel = mongoose.models.Blog || mongoose.model<BlogPost>('Blog', blogSchema);