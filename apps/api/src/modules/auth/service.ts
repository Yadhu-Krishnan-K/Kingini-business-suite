import { getRepositoryHealth } from "./repository.ts";

export const getHealthMessage = () => {
  return getRepositoryHealth();
};