'use client';
import React from "react";
import ChallengeForm from "@/app/admin/_components/ChallengeForm";
import challengeData from "@/data/challengeData.json"; // Mock data
import { GoBackButton } from "@/components/Components";

function EditChallengePage({ params }: { params: Promise<{ id: string }> }) {
    const [unwrappedParams, setUnwrappedParams] = React.useState<{ id: string } | null>(null);

    React.useEffect(() => {
        // Unwrap the `params` promise
        params.then(setUnwrappedParams);
    }, [params]);

    if (!unwrappedParams) {
        return <div>Loading...</div>;
    }

    const { id } = unwrappedParams;
    const challenge = challengeData.find((c) => c.id === Number(id));

    if (!challenge) {
        return <div>Challenge not found</div>;
    }

    const handleUpdate = async (data: any) => {
        console.log("Updating challenge:", data);
        // API call to update the challenge
        // await fetch(`/api/challenges/${id}`, { method: "PUT", body: JSON.stringify(data) });
    };

    return (
        <div>
            <div className='bg-white flex text-sm items-center gap-2 px-8 py-3 border-y border-gray-200'>
                <GoBackButton />
                <p className='text-gray-600 mr-2'>Go Back</p>
                <p className='text-gray-600'>Challenges & Hackathons / Edit Challenge /</p>
                <p className='text-primary'>{challenge.title}</p>
            </div>
            <ChallengeForm initialData={challenge} onSubmit={handleUpdate} />
        </div>
    );
}

export default EditChallengePage;
