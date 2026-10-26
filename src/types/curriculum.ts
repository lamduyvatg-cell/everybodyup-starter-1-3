export type UnitId = 'unit1' | 'unit2' | 'unit3';

export interface VocabItem {
  id: string;
  word: string;
  vietnamese: string;
  unit: UnitId;
  lesson: number;
  category: 'supplies' | 'toys' | 'colors' | 'phonics';
  iconKey: string;
  sentenceExample: string;
  sentenceVietnamese: string;
  phonicsLetter?: string;
}

export interface PhonicsItem {
  letter: string;
  upperLetter: string;
  lowerLetter: string;
  letterNameIpa: string;
  sound: string;
  letterPronounceText: string;
  soundPronounceText: string;
  word: string;
  wordPronounceText?: string;
  vietnamese: string;
  iconKey: string;
  unit: UnitId;
}

export interface ConversationItem {
  id: string;
  unit: UnitId;
  title: string;
  dialogue: { speaker: string; text: string; vietnamese: string }[];
  moralValue: string;
}

export type QuestionType = 'listen_and_choose' | 'picture_to_word' | 'phonics_match' | 'sentence_complete' | 'color_identify';

export interface QuizQuestion {
  id: string;
  unit: UnitId | 'all';
  type: QuestionType;
  promptVi: string;
  audioPromptEn?: string;
  audioPromptVi?: string;
  targetVocabId?: string;
  imageKey?: string;
  questionText?: string;
  options: {
    id: string;
    text: string;
    subText?: string;
    imageKey?: string;
    colorHex?: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}
