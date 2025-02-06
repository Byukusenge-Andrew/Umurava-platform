import { MoveLeft } from 'lucide-react'
import React from 'react'
import challengeData from "@/data/challengeData.json";
import ChallengeCard from '../../../components/ChallengeCard';
import { GoBackButton } from '@/components/Components';

function page() {
    return (
        <div className='bg-[#F9FAFB] pt-28 pb-16 px-5 sm:px-14'>
            <div className='flex items-center gap-2'>
                <GoBackButton />
                <p className='text-gray-600'>Go Back</p>
                <p className='text-primary '>/ Challenges & Hackathons</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between gap-6 mt-10">
                {challengeData.slice(0, 12).map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
            </div>
        </div>
    )
}

export default page