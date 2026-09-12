export interface ReelItem {
  id: string;
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  views: string;
  viewCountNum: number;
  likes: string;
  shares: string;
  posterUrl: string;
  videoUrl: string;
  duration: string;
}

export const MOCK_REELS: ReelItem[] = [];
