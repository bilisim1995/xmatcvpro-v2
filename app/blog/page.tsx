import { Metadata } from 'next';
import { BlogList } from '@/components/blog/blog-list';
import { BlogCategories } from '@/components/blog/blog-categories';

export const metadata: Metadata = {
  title: 'Blog | xmatch.pro',
  description: 'Latest articles and updates from xmatch.pro',
  openGraph: {
    title: 'Blog | xmatch.pro',
    description: 'Latest articles and updates from xmatch.pro',
    type: 'website',
  }
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h1 className="text-4xl font-bold mb-8">Blog</h1>
          <BlogList />
        </div>
        <div className="lg:col-span-1">
          <BlogCategories />
        </div>
      </div>
    </div>
  );
}