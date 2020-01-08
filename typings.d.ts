declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    APP_SECRET: string
    PORT: string
  }
}
