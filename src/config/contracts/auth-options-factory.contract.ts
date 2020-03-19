export interface AuthOptions {
  enabled: boolean;
}

export interface AuthOptionsFactory {
  createAuthOptions(): AuthOptions;
}
