// themeSelector.ts
import { selector } from "recoil";
import { themeState } from "./themeState";

export const themeSelector = selector<string>({
  key: "themeSelector",
  get: ({ get }) => {
    const theme = get(themeState);
    return `bx--theme--${theme}`;
  },
});
