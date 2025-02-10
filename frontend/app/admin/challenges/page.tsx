import { FilterTab } from '@/components/Components'
import challengeData from "@/data/challengeData.json";
import ChallengeCard from '@/components/ChallengeCard';
import React from 'react'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getChallenges } from '@/app/actions/challenges';
import { Challenge } from '@/app/types/challenge';

async function page() {

    const challenges: Challenge[] = await getChallenges(6);

    return (
        <div className='flex flex-col gap-10 py-6 px-8'>
            <div>
                <h2 className='text-2xl font-bold'>Challenges,</h2>
                <p className='text-gray-600 text-sm'>Join a challenge or a hackathon to gain valuable work experience.</p>
            </div>
            <div>
                <div className='flex items-center gap-4 pb-4 border-b border-gray-200'>
                    <FilterTab tab="all" label="All Challenges" count={10} />
                    <FilterTab tab="completed" label="Completed Challenges" count={10} />
                    <FilterTab tab="open" label="Open Challenges" count={10} />
                    <FilterTab tab="ongoing" label="Ongoing Challenges" count={10} />
                    <Button type="submit" className="bg-primary text-xs text-white" asChild>
                        <Link href={"/admin/challenges/new"}>
                            <Plus />
                            Create New Challenge
                        </Link>
                    </Button>
                </div>
                { challenges.length !==0 ? (
                <div className="grid grid-cols-3 gap-6 mt-4">
                    {challenges.slice(0, 6).map((challenge) => (
                        <ChallengeCard key={challenge._id} challenge={challenge} />
                    ))}
                </div>
                ) : (
                    <p className="mt-1 text-center text-sm text-gray-600">
                        You have not created any challenges yet!
                    </p>
                )}
            </div>
        </div>
    )
}

export default page