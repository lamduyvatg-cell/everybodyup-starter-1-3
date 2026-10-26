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
  sound: string;
  word: string;
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

export interface StudentScoreRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  unit: string;
  score: number; // 0 - 10
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  timestamp: string;
  details: {
    questionId: string;
    isCorrect: boolean;
    questionText: string;
    chosenAnswer: string;
    correctAnswer: string;
  }[];
  notes?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  className: string;
  avatar: string;
  createdDate: string;
}
