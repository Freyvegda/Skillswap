"use client"

import React, { useState } from 'react';
import { Mail, Lock, User, MapPin, Eye, EyeOff, Music, Code, Palette, Languages, Camera, Utensils, Dumbbell, BookOpen } from 'lucide-react';
import { useRouter } from "next/navigation";

interface AuthFormData{
    name: string;
    email: string;
    password: string;
    location: string;
    skillsOffered: string[];
    skillsWanted: string[];
}

interface skill{
    id: string,
    name: string,
    icon: React.ElementType
}


const AuthPage = () =>{
    //setting up state variables
    const [isSignup, setIsSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const [formData, setFormData] = useState<AuthFormData>({
        name: " ",
        email: " ",
        password: " ",
        location: " ",
        skillsOffered: [],
        skillsWanted: []
    })


    //list of all skills 
    const skills : skill[] = [
        { id: 'music', name: 'Music', icon: Music },
        { id: 'programming', name: 'Programming', icon: Code },
        { id: 'design', name: 'Design', icon: Palette },
        { id: 'languages', name: 'Languages', icon: Languages },
        { id: 'photography', name: 'Photography', icon: Camera },
        { id: 'cooking', name: 'Cooking', icon: Utensils },
        { id: 'fitness', name: 'Fitness', icon: Dumbbell },
        { id: 'writing', name: 'Writing', icon: BookOpen },
    ];

    //selection logic of skill
    const toggleSkill = (skillName: string, type: "offered" | "wanted") => {
        setFormData((prev) => {
            const skillArray = type === "offered" ? prev.skillsOffered : prev.skillsWanted;
            const isSelected = skillArray.includes(skillName);

            return {
                ...prev,
                [type === "offered" ? "skillsOffered" : "skillsWanted"]: isSelected
                ? skillArray.filter((s) => s !== skillName)
                : [...skillArray, skillName],
            };
        });
    };


    //submit logic:
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try{
            const endpoint = isSignup ? '/api/user/register' : '/api/user/login'
            const body= isSignup ? 
            formData
            : {email: formData.email, password: formData.password};

            const response = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })

            const data = await response.json();

            if(data.success){
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));

                alert(isSignup ? 'Account created successfully!' : 'Login successful!');

                //redirect to dashboard
                router.push('/');
            }
            else{
                alert(data.msg || data.message || 'An error occurred');
            }
        }
        catch(err){
            console.error('Auth error:', err);
            alert('An error occurred. Please try again.');
        }
        finally{
            setLoading(false);
        }
    }   


    return(
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden'>

                {/** Header */}
                <div className='bg-gradient-to-r from-emerald-500 to-teal-600 text-center text-white'>
                    <h1 className='text-4xl font-bold mb-2'>
                        {isSignup ? 'Join SkillSwap': 'Welcome Back'}
                    </h1>
                    <p className='text-emerald-100'>
                        {isSignup ? 'Start your skill exchange journey' : 'Sign in to continue your journey'}
                    </p>
                </div>


                {/** Toggle Button */}
                <div className='flex border-b border-gray-200'>
                    <button onClick={()=>setIsSignup(true)}
                        className={`flex-1 py-4 text-center font-semibold transition-colors ${
                        isSignup
                            ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                        >
                        Sign Up
                    </button>
                    <button onClick={()=>setIsSignup(false)}
                        className={`flex-1 py-4 text-center font-semibold transition-colors ${
                        !isSignup
                            ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                        >
                        Sign In
                    </button>
                </div>


                {/** Form */}
                <form onSubmit={handleSubmit} className='p-8'>
                    {isSignup && (
                        <>
                            {/* Name Field */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                                <div className='relative'>
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        required
                                        value = {formData.name}
                                        onChange={(e)=>setFormData({...formData, name:e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                                </label>
                                <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                    placeholder="San Francisco, CA"
                                />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Email Field*/}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>


                    {/* Password Field */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                        </label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {isSignup && (
                        <p className="mt-1 text-xs text-gray-500">
                            Min 6 characters, with uppercase, lowercase, and number
                        </p>
                        )}
                    </div>


                    {isSignup && (
                        <>
                        {/* Skills You Can Teach */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                            Skills You Can Teach
                            </label>
                            <p className="text-xs text-gray-500 mb-3">Select skills you're confident teaching</p>
                            <div className="grid grid-cols-4 gap-3">
                            {skills.map((skill) => {
                                const Icon = skill.icon;
                                const isSelected = formData.skillsOffered.includes(skill.name);
                                return (
                                <button
                                    key={skill.id}
                                    type="button"
                                    onClick={() => toggleSkill(skill.name, 'offered')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                                    isSelected
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                                    }`}
                                >
                                    <Icon className="w-6 h-6 mb-2" />
                                    <span className="text-xs font-medium text-center">{skill.name}</span>
                                </button>
                                );
                            })}
                            </div>
                        </div>

                        {/* Skills You Want to Learn */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                            Skills You Want to Learn
                            </label>
                            <p className="text-xs text-gray-500 mb-3">Select skills you're interested in learning</p>
                            <div className="grid grid-cols-4 gap-3">
                                {skills.map((skill) => {
                                    const Icon = skill.icon;
                                    const isSelected = formData.skillsWanted.includes(skill.name);
                                    return (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => toggleSkill(skill.name, 'wanted')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                                        isSelected
                                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                                            : 'border-gray-200 hover:border-teal-300 text-gray-600'
                                        }`}
                                    >
                                        <Icon className="w-6 h-6 mb-2" />
                                        <span className="text-xs font-medium text-center">{skill.name}</span>
                                    </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="mb-6 flex items-start">
                            <input
                                type="checkbox"
                                required
                                id="terms"
                                className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="#" className="text-emerald-600 hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-emerald-600 hover:underline">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>
                        </>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </span>
                        ) : (
                        <span className="flex items-center justify-center">
                            {isSignup ? 'Create Account' : 'Sign In'}
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        )}
                    </button>
                    

                    {!isSignup && (
                        <div className="mt-4 text-center">
                        <a href="#" className="text-sm text-emerald-600 hover:underline">
                            Forgot password?
                        </a>
                        </div>
                    )}
                </form>


                {/* Bottom Banner */}
                <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Join <span className="font-semibold text-emerald-600">1000+</span> learners worldwide
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage