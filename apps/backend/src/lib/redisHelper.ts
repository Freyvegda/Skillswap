import redisClient from "./redis.js";

const CACHE_EXPIRY = 3600;

//Get Data from redis:
export const getFromCache = async (key: string): Promise<any | null> =>{
    try{
        const data= await redisClient.get(key);
        return data ? JSON.parse(data): null
    }
    catch(error){
        console.error('Redis CLient error:',error);
        return null;
    }
}


//set Data to redis cache
export const setCache = async (
  key: string,
  value: any,
  expiryInSeconds: number = CACHE_EXPIRY
): Promise<boolean> => {
  try {
    const expire = Number(expiryInSeconds);

    // If 0, store without expiry
    if (expire === 0) {
      await redisClient.set(key, JSON.stringify(value));
      return true;
    }

    // Validate positive expiry
    if (!expire || expire < 0) {
      throw new Error(`Invalid expiry time: ${expiryInSeconds}`);
    }

    await redisClient.set(key, JSON.stringify(value), { EX: expire });
    return true;
  } catch (err) {
    console.error('Error setting cache value:', err);
    return false;
  }
};


//delete data from redis cache:
export const deleteCache = async (key: string): Promise<boolean> =>{
    try{
        await redisClient.del(key);
        return true;
    }
    catch(err){
        console.error('Error deleting value', err);
        return false;
    }
} 


//increment counter in redis:
export const incrementCounter = async (key: string): Promise<number> => {
  try {
    return await redisClient.incr(key);
  } catch (error) {
    console.error('Redis increment error:', error);
    return 0;
  }
};


//Get multiple keys
export const getKeysByPattern = async (pattern: string): Promise<string[]> => {
  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    console.error('Redis KEYS error:', error);
    return [];
  }
};