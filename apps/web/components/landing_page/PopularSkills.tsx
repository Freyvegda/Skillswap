"use client"

import React, { useEffect, useState } from 'react';
import { 
  Music, 
  Code, 
  Palette, 
  Languages, 
  Camera, 
  Utensils, 
  Dumbbell, 
  BookOpen,
  Star,
  Loader2
} from 'lucide-react';
import axios from "axios"
import {ApiResponse} from '@repo/common/types'
import { motion, Variants } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface SkillData{
    name: string,
    count: number,
    icon: string,
}


//fetching the skills 
export const fetchSkills = async (): Promise<SkillData[]> =>{
    try{
        const response = await apiClient.get<ApiResponse<SkillData[]>>('/skills/popular')
        return response.data.data ?? [];
    }
    catch(err){
        console.error(err);
        return [];
    }
}


//rebuilding the cache
export const rebuildSkillsCache = async (): Promise<boolean> => {
  try {
    const response = await apiClient.post<ApiResponse<null>>('/skills/rebuild-cache');
    return response.data.success;
  } catch (error) {
    console.error('Error rebuilding skills cache:', error);
    return false;
  }
};


const iconMap: Record<string, any> = {
  music: Music,
  code: Code,
  palette: Palette,
  languages: Languages,
  camera: Camera,
  utensils: Utensils,
  dumbbell: Dumbbell,
  book: BookOpen,
  star: Star,
};


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
    },
  },
};


export const PopularSkills = () =>{

  const [skills, setSkills] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    loadSkills()
  }, [])
  
  const loadSkills = async () =>{
    try{
      setLoading(true);
      const data = await fetchSkills();
      setSkills(data);
    }
    catch(err){
      console.error("failed to load skills", err);
    }
    finally{
      setLoading(false);
    }
  }

   // Fallback colors for skills
  const colorClasses = [
    'bg-teal-50',
    'bg-emerald-50',
    'bg-cyan-50',
    'bg-blue-50',
    'bg-green-50',
    'bg-indigo-50',
  ];

  if (loading) {
    return (
      <section id="browse-skills" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Skills
            </h2>
            <p className="text-xl text-gray-600">Browse thousands of skills</p>
          </div>

          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

   if (error) {
    return (
      <section id="browse-skills" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Skills
            </h2>
            <p className="text-xl text-gray-600">Browse thousands of skills</p>
          </div>

          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadSkills}
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }


  return (
     <section id="browse-skills" className="bg-emerald-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular Skills
          </h2>
          <p className="text-xl text-gray-600">
            Browse {skills.length > 0 ? "thousands of" : ""} skills
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No skills available yet. Be the first to share your skills!
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skills.slice(0, 12).map((skill, index) => {
              const Icon = iconMap[skill.icon] || Star;
              const colorClass = colorClasses[index % colorClasses.length];

              return (
                <motion.div
                  key={skill.name}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="flex flex-col items-center p-6 rounded-2xl bg-emerald-200 hover:bg-emerald-100 transition cursor-pointer group shadow-md hover:shadow-lg"
                >
                  <div
                    className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}
                  >
                    <Icon className="w-8 h-8 text-emerald-600 bg-emerald-50" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-600">{skill.count} users</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {skills.length > 12 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition font-medium shadow-md hover:shadow-lg"
            >
              View All Skills
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );

}