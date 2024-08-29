interface AnantaOptions {
  sensitivity?: number;
  language?: string;
  threshold?: number;
  context?: string;
  includeEmotions?: boolean;
  includeReport?: boolean;
  includeRawProbability?: boolean;
  ignoreStopwords?: boolean;
  customEntities?: string[];
  llmApiKey: string;
}

export type { AnantaOptions };
