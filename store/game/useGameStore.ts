import { create } from "zustand";
import { GameState, WageringGame } from "@/types/game";

interface GameStore extends GameState {
  fetchGames: () => void;
  joinGame: (gameId: string) => void;
}

const mockGames: WageringGame[] = [
  {
    id: "1",
    title: "500 Steps Challenge",
    shortDescription: "Walk 500 steps daily for a week!",
    fullDescription:
      "Challenge yourself to walk 10,000 steps every day for a full week. Track your progress using your smartphone or fitness tracker. The person with the highest total steps at the end of the week wins the grand prize!",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "fitness",
    goal: 3500,
    unit: "steps",
    duration: 7,
    entryFee: 5,
    prize: 100,
    participantCount: 50,
    startDate: "2024-07-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Language Learning Sprint",
    shortDescription: "Learn 100 new words in a foreign language!",
    fullDescription:
      "Expand your vocabulary in a language of your choice. Learn and memorize 100 new words in 30 days. Prove your knowledge through a final test. The top 3 scorers win prizes!",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1666739032615-ecbd14dfb543?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "learning",
    goal: 100,
    unit: "words",
    duration: 30,
    entryFee: 10,
    prize: 200,
    participantCount: 30,
    startDate: "2024-08-01T00:00:00Z",
  },
  {
    id: "3",
    title: "Meditation Marathon",
    shortDescription: "Meditate for 30 minutes daily for a month!",
    fullDescription:
      "Cultivate mindfulness by meditating for 30 minutes every day for a full month. Track your sessions using a meditation app. Those who complete all 30 days split the prize pool!",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "lifestyle",
    goal: 900,
    unit: "minutes",
    duration: 30,
    entryFee: 15,
    prize: 300,
    participantCount: 40,
    startDate: "2024-07-20T00:00:00Z",
  },
  {
    id: "4",
    title: "Social Media Detox",
    shortDescription: "Stay off social media for a week!",
    fullDescription:
      "Challenge yourself to a week-long social media detox. No Facebook, Instagram, Twitter, or TikTok for 7 full days. Use a screen time tracking app to prove your abstinence. All successful participants split the prize!",
    imageUrl:
      "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "social",
    goal: 7,
    unit: "days",
    duration: 7,
    entryFee: 5,
    prize: 100,
    participantCount: 60,
    startDate: "2024-07-25T00:00:00Z",
  },
  {
    id: "5",
    title: "Book Worm Challenge",
    shortDescription: "Read 3 books in a month!",
    fullDescription:
      "Read three full-length books (min. 200 pages each) in one month. Submit brief book reports as proof. The first person to complete all three books wins the grand prize!",
    imageUrl:
      "https://images.unsplash.com/photo-1523689094115-65c863cf262d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "learning",
    goal: 3,
    unit: "books",
    duration: 30,
    entryFee: 10,
    prize: 150,
    participantCount: 25,
    startDate: "2024-08-05T00:00:00Z",
  },
];

const useGameStore = create<GameStore>((set) => ({
  games: [],
  isLoading: false,
  error: null,

  fetchGames: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ games: mockGames, isLoading: false });
    }, 1000);
  },

  joinGame: (gameId: string) => {
    set((state) => ({
      games: state.games.map((game) =>
        game.id === gameId
          ? { ...game, participantCount: game.participantCount + 1 }
          : game
      ),
    }));
    console.log(`Joined game with id: ${gameId}`);
  },
}));

export default useGameStore;
