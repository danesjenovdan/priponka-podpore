export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NEUTRAL = 'NEUTRAL'
}

export enum StickerVariant {
  VOTE = 'VOTE',
  DIGNIFIED = 'DIGNIFIED',
  RIGHTS = 'RIGHTS'
}

export interface GeneratedCaption {
  text: string;
  hashtags: string[];
}