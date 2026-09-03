export const StatusCode = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
} as const;

export type StatusType = (typeof StatusCode)[keyof typeof StatusCode];