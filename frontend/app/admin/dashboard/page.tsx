'use client'
import { AdminMetricCard, MetricCard } from '@/components/Components'
import { Button } from '@/components/ui/button'
import ChallengeCard from '@/components/ChallengeCard';
import { Bell, ChevronRight, Eye, FileText, Users } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import MetricCardContainer from '../_components/MetricCardContainer';
import { Challenge } from '@/app/types/challenge';
import { getByCreatorId, getChallenges } from '@/app/actions/challenges';
import ChallengeCardSkeleton from '@/components/skeletons/ChallengeCardSkeleton';

function page() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const challengeData = await getByCreatorId(3, localStorage.getItem('_id'), localStorage.getItem('authToken'));
                console.log("Challenge data:", challengeData);

                if (challengeData && Object.keys(challengeData).length === 0) {
                    // If the fetched data is an empty object, treat it as a 404
                    setChallenges([]);
                } else {
                    setChallenges(challengeData);
                }
            } catch (error) {
                console.error("Error fetching challenge:", error);
                setChallenges([]); // In case of an error, treat it as a 404
            } finally {
                setIsLoading(false);
            }
        };

        fetchChallenge();
    }, []);

    return (
        <div className='flex flex-col gap-10 py-6 px-4 sm:px-8'>
            <div className='w-full flex flex-col sm:flex-row space-y-6 sm:space-y-0 justify-between items-center'>
                <div>
                    <h2 className='text-2xl text-center sm:text-start font-bold'>Welcome back {localStorage.getItem('name')},</h2>
                    <p className='text-gray-600 text-sm text-center sm:text-start'>Build Work Experience through Skills Challenges</p>
                </div>
                <Button className="bg-primary text-xs text-white">
                    <Eye className='text-white h-5 w-5' /> View Profile
                </Button>
            </div>
            <MetricCardContainer />
            <div>
                <div className='w-full flex justify-between items-center text-sm mb-4'>
                    <p className='font-bold'>Recent Challenges</p>
                    <Link href="/admin/challenges" className='flex items-center text-primary'>
                        See all <ChevronRight className='h-6 w-6' />
                    </Link>
                </div>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 mt-4">
                        {[...Array(3)].map((_, index) => (
                            <ChallengeCardSkeleton key={index} />
                        ))}
                    </div>
                ) : challenges.length !== 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 mt-4">
                        {challenges.slice(0, 3).map((challenge) => (
                            <ChallengeCard key={challenge._id} challenge={challenge} />
                        ))}
                    </div>
                ) : (
                    <p className="mt-10 text-center text-sm text-gray-600">
                        You have not created any challenges yet!
                    </p>
                )}
            </div>
        </div>
    )
}

export default page