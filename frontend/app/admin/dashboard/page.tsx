import { AdminMetricCard, MetricCard } from '@/components/Components'
import { Button } from '@/components/ui/button'
import challengeData from "@/data/challengeData.json";
import ChallengeCard from '@/components/ChallengeCard';
import { Bell, ChevronRight, Eye, FileText, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import MetricCardContainer from '../_components/MetricCardContainer';

function page() {
    return (
        <div className='flex flex-col gap-10 py-6 px-8'>
            <div className='w-full flex justify-between items-center'>
                <div>
                    <h2 className='text-2xl font-bold'>Welcome back Hilaire,</h2>
                    <p className='text-gray-600 text-sm'>Build Work Experience through Skills Challenges</p>
                </div>
                <Button className="bg-primary text-xs text-white">
                    <Eye className='text-white h-5 w-5' /> View Profile
                </Button>
            </div>
            <MetricCardContainer />
            <div>
                <div className='w-full flex justify-between items-center text-sm mb-4'>
                    <p className='font-bold'>Recent Challenges</p>
                    <Link href="/talent/challenges" className='flex items-center text-primary'>
                        See all <ChevronRight className='h-6 w-6' />
                    </Link>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {challengeData.slice(0, 3).map((challenge) => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default page