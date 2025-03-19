import { ModelDetails } from '../types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ModelValidation {
  validateModel: (data: any) => ValidationResult;
  sanitizeModel: (data: any) => ModelDetails;
}