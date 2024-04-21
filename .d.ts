export {};

declare global {
  namespace Express {
    interface User {
      id: number;
      // Add other properties as needed
    }
  }
}
