export interface AppConfig {
  redis: {
    host: string;
    port: number;
    password: string;
  };
  firebase: {
    projectId: string;
    privateKey: string;
    clientEmail: string;
    url: string;
  };
  servicePort: number;
}
