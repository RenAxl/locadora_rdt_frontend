import { TOKEN_KEY } from "../constants/token.constants";

export function tokenGetter(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
