import { create, SetState } from "zustand";

interface AuthState {
  email: string;
  password: string;
  isValidEmail: boolean;
  isValidPassword: boolean;
  emailWarning: string;
  passwordWarning: string;
  isAuthenticated: boolean | null;
}

interface AuthStore extends AuthState {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setIsValidEmail: (isValidEmail: boolean) => void;
  setIsValidPassword: (isValidPassword: boolean) => void;
  setEmailWarning: (emailWarning: string) => void;
  setPasswordWarning: (passwordWarning: string) => void;
  setAuthenticated: (isAuthenticated: boolean | null) => void;
}

const useAuthStore = create<AuthStore>((set: SetState<AuthStore>) => ({
  email: "",
  password: "",
  isValidEmail: false,
  isValidPassword: false,
  emailWarning: "",
  passwordWarning: "",
  isAuthenticated: null, // Initially unknown authentication state
  setEmail: (email: string) => set((state) => ({ email })),
  setPassword: (password: string) => set((state) => ({ password })),
  setIsValidEmail: (isValidEmail: boolean) =>
    set((state) => ({ isValidEmail })),
  setIsValidPassword: (isValidPassword: boolean) =>
    set((state) => ({ isValidPassword })),
  setEmailWarning: (emailWarning: string) => set((state) => ({ emailWarning })),
  setPasswordWarning: (passwordWarning: string) =>
    set((state) => ({ passwordWarning })),
  setAuthenticated: (isAuthenticated: boolean | null) =>
    set((state) => ({ isAuthenticated })),
}));

export default useAuthStore;
