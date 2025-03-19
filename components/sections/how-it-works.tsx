'use client';

export function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white mb-4">1</div>
          <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
          <p className="text-muted-foreground">Select or drag & drop your image</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white mb-4">2</div>
          <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
          <p className="text-muted-foreground">Our AI processes your image</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white mb-4">3</div>
          <h3 className="text-xl font-semibold mb-2">Get Results</h3>
          <p className="text-muted-foreground">View matching results instantly</p>
        </div>
      </div>
    </div>
  );
}