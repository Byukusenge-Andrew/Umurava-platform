'use client';
import React from "react";
import ChallengeForm from "../../_components/ChallengeForm";
import { GoBackButton } from "@/components/Components";

function NewChallengePage() {
  const handleCreate = async (data: any) => {
    // API call to create the challenge
    console.log("Creating challenge:", data);
    // await fetch("/api/challenges", { method: "POST", body: JSON.stringify(data) });
  };

  return (
    <div>
                <div className='bg-white flex text-sm items-center gap-2 px-8 py-3 border-y border-gray-200'>
                    <GoBackButton />
                    <p className='text-gray-600 mr-2'>Go Back</p>
                    <p className='text-gray-600'>Challenges & Hackathons /</p>
                    <p className='text-primary'>Create New Challenge</p>
                </div>
  <ChallengeForm onSubmit={handleCreate} />
    </div>
  );
}

export default NewChallengePage;
