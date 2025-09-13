export type GameState = 'start' | 'input' | 'generating' | 'game' | 'result' | 'gameover';

export interface UserInfo {
  gender: 'male' | 'female';
  dob: string;
}

export interface FortuneImagePrompts {
  meal: string;
  color: string;
  number: string;
  proverb: string;
}

export interface FortuneData {
  meal: string;
  color: string;
  number: number;
  proverb: string;
  imagePrompts: FortuneImagePrompts;
}


export interface FortuneImages {
  meal: string;
  color: string;
  number: string;
  proverb: string;
}