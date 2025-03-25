import { Request, Response, NextFunction } from 'express';
import { CacheFactory, CacheType } from '../../infraestructure/cache/cache.factory';

interface CacheOptions {
  ttl?: number;
  keyPrefix?: string;
  excludePaths?: string[];
  includePaths?: string[];
  methods?: string[];
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  const {
    ttl = 3600,
    keyPrefix = 'cache:',
    excludePaths = [],
    includePaths = [],
    methods = ['GET']
  } = options;

  const cache = CacheFactory.create(CacheType.REDIS);

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const startTime = Date.now();
    const cacheKey = `${keyPrefix}${req.originalUrl}`;

    if (excludePaths.some(path => req.path.startsWith(path))) {
      console.log(`[Cache] Ruta excluida: ${req.path}`);
      next();
      return;
    }

    if (includePaths.length > 0 && !includePaths.some(path => req.path.startsWith(path))) {
      console.log(`[Cache] Ruta no incluida: ${req.path}`);
      next();
      return;
    }

    if (!methods.includes(req.method)) {
      console.log(`[Cache] Método no permitido: ${req.method}`);
      next();
      return;
    }

    try {
      console.log(`[Cache] Intentando obtener datos para: ${cacheKey}`);
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        const endTime = Date.now();
        console.log(`[Cache] Datos encontrados en caché para: ${cacheKey}`);
        console.log(`[Cache] Tiempo de respuesta: ${endTime - startTime}ms`);
        // Parsear los datos cacheados antes de enviarlos
        const parsedData = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
        res.json(parsedData);
        return;
      }

      console.log(`[Cache] Datos no encontrados en caché para: ${cacheKey}`);
      
      const originalJson = res.json;
      let responseSent = false;

      res.json = function(data: any) {
        if (responseSent) return;
        responseSent = true;

        if (res.statusCode === 200) {
          console.log(`[Cache] Guardando datos en caché para: ${cacheKey}`);
          // Asegurarse de que los datos se guarden como JSON string
          const dataToCache = typeof data === 'string' ? data : JSON.stringify(data);
          cache.set(cacheKey, dataToCache, ttl).catch(error => {
            console.error(`[Cache] Error al guardar en caché: ${error.message}`);
          });
        }
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error(`[Cache] Error en middleware de caché: ${error.message}`);
      next();
    }
  };
}; 