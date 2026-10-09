import{neon}from'@neondatabase/serverless';import{drizzle}from'drizzle-orm/neon-http';import*as schema from'./schema';
export function dbForUrl(url:string){return drizzle(neon(url),{schema})}
