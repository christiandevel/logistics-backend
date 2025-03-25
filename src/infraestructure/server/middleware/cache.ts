import { CacheFactory, CacheType } from './../../../infraestructure/cache/cache.factory';
import { Request, Response, NextFunction } from 'express';

import colors from 'colors';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string; // Prefix for cache keys
  excludePaths?: string[]; // Rutas a excluir del caché
  includePaths?: string[]; // Rutas específicas a incluir en el caché
  methods?: string[]; // Métodos HTTP a cachear
}


const REDIS_TTL = parseInt(process.env.REDIS_TTL || '3600');
const cache = CacheFactory.create(CacheType.REDIS);

export const cacheMiddleware = (keyPrefix: string, ttl: number = REDIS_TTL) => {
  console.log(colors.yellow.bold('Cache middleware initialized'));

  return (req: Request, res: Response, next: NextFunction) => {

    const key = `${keyPrefix}:${req.originalUrl}`;
    cache.get(key).then((data) => {    
      
      if (data) {
        const parsedData = JSON.parse(data as string);
        if (parsedData.error) {
          cache.delete(key);
        } else {
          console.log(colors.green.bold(`Returing cached data for ${key}`));
          return res.json(parsedData);
        }
      }
      
      const originalSend = res.json;

      res.json = function (body: any): Response {
        if (!body.error) {
          console.log(colors.green.bold(`Caching data for ${key}`));
          cache.set(key, JSON.stringify(body), ttl).catch(err => {
            console.error(colors.red.bold(`Error caching data for ${key}:`), err);
          });
        } else {
          console.log(colors.red.bold(`Not caching data for ${key} due to error`));
        }

        return originalSend.call(this, body);
      }
      next();
    }).catch((error) => {
      console.error(colors.red.bold(`Error in cache middleware:`), error);
      next();
    });
  }
}
