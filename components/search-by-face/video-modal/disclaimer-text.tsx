'use client';

interface DisclaimerTextProps {
  modelName: string;
}

export function DisclaimerText({ modelName }: DisclaimerTextProps) {
  return (
    <p className="text-sm">
      You are about to view adult content featuring <strong>{modelName}</strong>. By proceeding, you confirm that:
      <br />
      • You are of legal age to view adult content
      <br />
      • This action complies with your local laws
      <br />
      • You accept full responsibility for your actions
    </p>
  );
}