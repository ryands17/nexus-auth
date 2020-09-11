declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    APP_SECRET: string
    PORT?: string
  }
}
