// themeState.ts
import { atom } from "recoil";

export const themeState = atom<string>({
  key: "themeState",
  default: localStorage.getItem("theme") || "g100",
});
