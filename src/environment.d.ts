declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      MONGO_SRV: string;
      GUILD_ID: string;
      BDAY_CHANNEL_ID: string;
      WELCOME_CHANNEL_ID: string;
      TEST_CHANNEL_ID: string;
      TEST_USER_ID: string;
    }
  }
}

export {};
