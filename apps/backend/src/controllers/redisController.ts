import prisma from "@repo/db";
import { getFromCache, setCache, incrementCounter, getKeysByPattern, deleteCache } from "../lib/redisHelper.js";

const SKILLS_CACHE_KEY = 'popular_skills';
const SKILL_COUNT_PREFIX = 'skill_count:';
const CACHE_EXPIRY = 3600; // 1 hour

interface SkillData{
    name: string, 
    count: number,
    icon: string
}


//update skill count when the user Registers or Updates profile.
export const updateSkillsCount = async (skillsOffered : string[], operation: 'add' | 'remove' = 'add'): Promise<void> =>{
    try{
        for(const skill of skillsOffered){
            const key = `${SKILL_COUNT_PREFIX}${skill.toLowerCase()}`;

            if(operation === 'add'){
                await incrementCounter;
            }
            else{
                const currentCounter = await getFromCache(key);
                if(currentCounter && currentCounter>0){
                    //no expiry for counters
                    await setCache(key, currentCounter - 1, 0);
                }
            }
        }

        await deleteCache(SKILLS_CACHE_KEY);
    }
    catch(err){
        console.error('Error updating the skills counter', err);
    }
}



//get skills from cache:
export const getSkills = async (): Promise<SkillData[]> => {
    try{
        const cachedSkills = await getFromCache(SKILLS_CACHE_KEY);
        if(cachedSkills){
            console.log("Returning popular skills from cache");
            return cachedSkills;
        }

        console.log("Fetching the skills from database:")

        const users = await prisma.user.findMany({
            select:{
                skillsOffered: true
            }
        });

        const skillCounts: Record<string, number> = {};
        users.forEach((user: { skillsOffered: any[]; }) =>{
            user.skillsOffered.forEach((skill)=>{
                const skillKey = skill;
                skillCounts[skillKey] = (skillCounts[skillKey] || 0) + 1;
            })
        })

        const skillIconMap: Record<string, string> = {
            Music: 'music',
            Programming: 'code',
            Design: 'palette',
            Languages: 'languages',
            Photography: 'camera',
            Cooking: 'utensils',
            Fitness: 'dumbbell',
            Writing: 'book',
        };

        //convert to array and sort by count:
        const popularSkills: SkillData[] = Object.entries(skillCounts)
        .map(([name, count]) => ({
            name,
            count,
            icon: skillIconMap[name] || 'star',
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 skills

        // Cache the results
        await setCache(SKILLS_CACHE_KEY, popularSkills, CACHE_EXPIRY);

        // Also update individual skill counters in Redis
        for (const skill of popularSkills) {
            const key = `${SKILL_COUNT_PREFIX}${skill.name.toLowerCase()}`;
            await setCache(key, skill.count, 0); // No expiry for counters
        }

        return popularSkills;
    }
    catch(err){
        console.error("Error getting popular skills:", err);
        return [];
    }
}


//Rebuild Skills cache:
export const rebuildSkillsCache = async (): Promise<void> => {
  console.log('Rebuilding skills cache...');
  
  // Clear existing cache
  await deleteCache(SKILLS_CACHE_KEY);
  
  // Clear all skill counters
  const skillKeys = await getKeysByPattern(`${SKILL_COUNT_PREFIX}*`);
  for (const key of skillKeys) {
    await deleteCache(key);
  }
  
  // Rebuild cache
  await getSkills();
  
  console.log('Skills cache rebuilt successfully');
};

