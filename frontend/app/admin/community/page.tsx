'use client';
import React, { useEffect, useState } from 'react';
import Modal from '../_components/Modal';
import { FilterTab } from '@/components/Components';
import challengeData from "@/data/challengeData.json";
import ChallengeCard from '@/components/ChallengeCard';

const Page = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true); // Show the modal when navigating to /community
  }, []);

  return (
    <div>
      {/* If showModal is true, render the Modal */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
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
                </div>
                <div className="grid grid-cols-3 gap-6 mt-4">
                    {challengeData.slice(0, 6).map((challenge) => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Page;
