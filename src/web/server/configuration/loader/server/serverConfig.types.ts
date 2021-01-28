export interface IServerConfig {
  apiPort: number;
  shutdownPort: number;
  shutdownTimeout: number;
  startupDelay: number;
  retryCount: number;
}
