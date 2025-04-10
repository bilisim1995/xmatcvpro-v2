import mongoose from 'mongoose';

export interface TopListCategory {
  _id: string;
  name: string;
  slug2: string;
  description: string;
  icon_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface TopListSite {
  _id: string;
  title: string;
  url: string;
  favicon_url?: string;
  description: string;
  keywords?: string;
  category_id: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

const topListCategorySchema = new mongoose.Schema<TopListCategory>({
  name: { type: String, required: true },
  slug2: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  description: { type: String, required: true },
  icon_name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure virtuals are included in JSON
topListCategorySchema.set('toJSON', { virtuals: true });
topListCategorySchema.set('toObject', { virtuals: true });


const topListSiteSchema = new mongoose.Schema<TopListSite>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  favicon_url: { type: String },
  description: { type: String, required: true },
  keywords: { type: String },
  category_id: { type: String, required: true },
  order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

topListSiteSchema.virtual('category', {
  ref: 'TopListCategory',
  localField: 'category_id',
  foreignField: '_id',
  justOne: true,
});

export const TopListCategoryModel = mongoose.models.TopListCategory || mongoose.model<TopListCategory>('TopListCategory', topListCategorySchema);
export const TopListSiteModel = mongoose.models.TopListSite || mongoose.model<TopListSite>('TopListSite', topListSiteSchema);