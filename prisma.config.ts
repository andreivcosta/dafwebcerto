import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: 'postgresql://postgres:1691@localhost:5432/projeto_dafweb?schema=public',
  },
});