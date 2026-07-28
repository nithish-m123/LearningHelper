// ponytail: Thin logging service (SOLID: Single Responsibility)
const getTimestamp = () => new Date().toISOString()

export const logger = {
  info: (msg: string, meta?: any) => 
    console.log(`INFO:(${getTimestamp()}):-${msg}${meta ? ` ${JSON.stringify(meta)}` : ''}`),
  
  error: (msg: string, err?: any) => 
    console.error(`ERROR:(${getTimestamp()}):-${msg}${err ? ` | ${err instanceof Error ? err.message : JSON.stringify(err)}` : ''}`),
  
  warn: (msg: string, meta?: any) => 
    console.warn(`WARN:(${getTimestamp()}):-${msg}${meta ? ` ${JSON.stringify(meta)}` : ''}`)
}
