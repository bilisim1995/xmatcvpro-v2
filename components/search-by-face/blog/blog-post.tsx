'use client';

import { Tag } from 'lucide-react';

interface BlogPostProps {
  title: string;
  excerpt: string;
  content?: string;
  tags: string[];
  footer?: React.ReactNode;
}

// Parse content and convert text headings to semantic HTML headings
function parseContent(content: string): React.ReactNode {
  if (!content) return null;
  
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // H2 headings - lines that look like section headings
    // Pattern: Contains "?" or ":" and is not too long, or starts with ⭐
    if (trimmedLine && (
      trimmedLine.startsWith('⭐') ||
      (trimmedLine.includes('?') && trimmedLine.length < 100 && !trimmedLine.includes('.')) ||
      (trimmedLine.includes(':') && trimmedLine.length < 80 && !trimmedLine.includes('.') && !trimmedLine.match(/^[a-z]/))
    )) {
      // Close current paragraph or list
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`ul-${index}`} className="list-disc list-inside mb-4 space-y-2">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${index}`} className="mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
      
      // Add H2 heading
      elements.push(
        <h2 key={`h2-${index}`} className="text-xl font-bold mt-6 mb-4 text-foreground">
          {trimmedLine}
        </h2>
      );
    }
    // H3 headings - shorter lines ending with ":"
    else if (trimmedLine && trimmedLine.endsWith(':') && trimmedLine.length < 60 && !trimmedLine.includes('.')) {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`ul-${index}`} className="list-disc list-inside mb-4 space-y-2">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${index}`} className="mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
      elements.push(
        <h3 key={`h3-${index}`} className="text-lg font-semibold mt-4 mb-3 text-foreground">
          {trimmedLine}
        </h3>
      );
    }
    // List items
    else if (trimmedLine.match(/^[-•]\s/) || trimmedLine.match(/^\d+\.\s/)) {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${index}`} className="mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
      const listText = trimmedLine.replace(/^[-•]\s/, '').replace(/^\d+\.\s/, '');
      listItems.push(listText);
      inList = true;
    }
    // Regular paragraph text
    else if (trimmedLine) {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`ul-${index}`} className="list-disc list-inside mb-4 space-y-2">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      currentParagraph.push(trimmedLine);
    }
    // Empty line - close paragraph or list
    else {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`ul-${index}`} className="list-disc list-inside mb-4 space-y-2">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${index}`} className="mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
    }
  });
  
  // Close remaining list
  if (inList && listItems.length > 0) {
    elements.push(
      <ul key="ul-last" className="list-disc list-inside mb-4 space-y-2">
        {listItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  
  // Close last paragraph
  if (currentParagraph.length > 0) {
    elements.push(
      <p key="p-last" className="mb-4">
        {currentParagraph.join(' ')}
      </p>
    );
  }
  
  return <>{elements}</>;
}

export function BlogPost({ title, excerpt, content, tags, footer }: BlogPostProps) {
  const displayContent = content || excerpt;
  const parsedContent = content ? parseContent(content) : null;
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt,
    "articleBody": content || excerpt,
    "keywords": tags.join(", "),
    "author": {
      "@type": "Organization",
      "name": "xmatch.pro"
    },
    "publisher": {
      "@type": "Organization",
      "name": "xmatch.pro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://xmatch.pro/m1.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://xmatch.pro"
    }
  };
  
  return (
    <article className="group relative py-6" itemScope itemType="https://schema.org/BlogPosting">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="absolute -inset-y-2 -inset-x-4 group-hover:bg-muted/50 rounded-xl transition-all duration-300" />
      <div className="relative p-4">
        <header className="mb-4">
          <h2 className="text-xl font-semibold mb-2" itemProp="headline">
            {title}
          </h2>
          <meta itemProp="description" content={excerpt} />
          <meta itemProp="datePublished" content={new Date().toISOString()} />
          <meta itemProp="dateModified" content={new Date().toISOString()} />
        </header>
        
        <div className="text-muted-foreground mb-4 prose prose-sm max-w-none dark:prose-invert" itemProp="articleBody">
          {parsedContent || <p>{displayContent}</p>}
        </div>
        
        <footer className="mt-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-muted-foreground" aria-label="Tags" />
            <div className="flex flex-wrap gap-2" itemProp="keywords">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors"
                  itemProp="about"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </footer>

        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </div>
    </article>
  );
}