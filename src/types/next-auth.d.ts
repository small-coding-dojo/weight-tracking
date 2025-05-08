import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider`
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      /** The user's username. */
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    /** The user's username. */
    username?: string;
  }
}
