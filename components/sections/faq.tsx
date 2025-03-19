'use client';

export function FAQ() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">What file formats are supported?</h3>
          <p className="text-muted-foreground">We support JPG, PNG, and WEBP formats.</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Is my data secure?</h3>
          <p className="text-muted-foreground">All uploads are encrypted and automatically deleted after processing.</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">How accurate are the results?</h3>
          <p className="text-muted-foreground">Our AI provides up to 99% accuracy in matching.</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">How fast are the results?</h3>
          <p className="text-muted-foreground">Results are typically delivered within seconds.</p>
        </div>
      </div>
    </div>
  );
}