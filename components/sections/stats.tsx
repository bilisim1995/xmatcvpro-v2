'use client';

export function Stats() {
  return (
    <div className="container mx-auto px-4 py-16 border-y bg-card/50">
      <div className="grid md:grid-cols-4 gap-8 text-center">
        <div>
          <h3 className="text-3xl font-bold text-red-600">1M+</h3>
          <p className="text-muted-foreground">Models in Database</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-red-600">50K+</h3>
          <p className="text-muted-foreground">Daily Searches</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-red-600">99%</h3>
          <p className="text-muted-foreground">Accuracy Rate</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-red-600">24/7</h3>
          <p className="text-muted-foreground">Support Available</p>
        </div>
      </div>
    </div>
  );
}