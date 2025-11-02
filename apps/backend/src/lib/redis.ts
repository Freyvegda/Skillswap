import {createClient, type RedisClientType} from 'redis'

const redisClient: RedisClientType = createClient({
    url : process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('Redis reconnection failed after 10 attempts');
                return new Error('Redis reconnection failed');
            }
            return retries * 100;
        },
    },
})

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Connected'));

// Connect to Redis
(async () => {
  try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
})();

export default redisClient;
