export type GameCategory = "fitness" | "learning" | "lifestyle" | "social";

export interface WageringGame {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  category: GameCategory;
  goal: number;
  unit: string;
  duration: number;
  entryFee: number;
  prize: number;
  participantCount: number;
  startDate: string;
}

export interface GameState {
  games: WageringGame[];
  isLoading: boolean;
  error: string | null;
}
