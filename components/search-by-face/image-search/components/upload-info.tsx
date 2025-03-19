'use client';

interface UploadInfoProps {
  image: string | null;
}

export function UploadInfo({ image }: UploadInfoProps) {
  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-medium mb-2">
        {image ? 'Image ready' : 'Drop image here'}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        or click to upload
      </p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted">
          JPG, PNG
        </span>
        <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted">
          Max 5MB
        </span>
      </div>
    </div>
  );
}