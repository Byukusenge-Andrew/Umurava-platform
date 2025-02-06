"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { BulletPointTextarea } from "@/components/ui/bullet-point-textarea";

interface ChallengeFormProps {
    initialData?: {
        title: string;
        deadline?: string;
        duration?: string;
        challengeDetails?: {
            challengeDescription: string;
            contactEmail: string;
            moneyPrize: string;
            deliverables: string[];
            tasks: {
                productRequirements: string[];
                productDesign: string[];
            };
        };
    };
    onSubmit: (data: any) => void;
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({ initialData, onSubmit }) => {
    const router = useRouter();

    const [formData, setFormData] = React.useState({
        title: initialData?.title || "",
        deadline: initialData?.deadline || "",
        duration: initialData?.duration || "",
        description: initialData?.challengeDetails?.challengeDescription || "",
        email: initialData?.challengeDetails?.contactEmail || "",
        prize: initialData?.challengeDetails?.moneyPrize || "",
        deliverables: initialData?.challengeDetails?.deliverables || [],
        requirements: initialData?.challengeDetails?.tasks.productRequirements || [],
        design: initialData?.challengeDetails?.tasks.productDesign || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedData = {
            title: formData.title,
            deadline: formData.deadline,
            duration: formData.duration,
            challengeDetails: {
                challengeDescription: formData.description,
                contactEmail: formData.email,
                moneyPrize: formData.prize,
                requirements: formData.requirements,
                design: formData.design
            }
        };

        onSubmit(formattedData);
    };

    return (
        <div className="flex justify-center items-center py-6 px-8">
            <form onSubmit={handleSubmit} className="bg-white px-6 py-6 border border-gray-200 rounded-lg w-fit">
                <div className="w-[30rem] space-y-6">
                    <div>
                        {initialData && (
                            <h2 className="text-center text-lg font-bold">Edit a Challenge</h2>
                        )}
                        <h2 className="text-gray-600 text-sm text-center mb-8">Fill out these details to build your broadcast</h2>
                    </div>

                    <div className="grid min-w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="title">Challenge/Hackathon Title</Label>
                        <Input type="text" id="title" name="title" placeholder="Enter title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="deadline">Deadline</Label>
                            <input className="py-1.5 px-3 rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#FA9874]" type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} required />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="duration">Duration</Label>
                            <Input type="text" id="duration" name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="prize">Money Prize</Label>
                            <Input type="text" id="prize" name="prize" placeholder="Prize" value={formData.prize} onChange={handleChange} required />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Contact Email</Label>
                            <Input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="grid min-w-full gap-1.5">
                        <Label htmlFor="description">Project Brief</Label>
                        <BulletPointTextarea />
                        <p className="text-xs text-gray-600">Keep this simple of 250 character</p>
                    </div>

                    <div className="grid min-w-full gap-1.5">
                        <Label htmlFor="tasks">Product Requirements</Label>
                        <BulletPointTextarea />
                        <p className="text-xs text-gray-600">Keep this simple of 500 character</p>
                    </div>

                    <div className="grid min-w-full gap-1.5">
                        <Label htmlFor="tasks">Product Design</Label>
                        <BulletPointTextarea />
                        <p className="text-xs text-gray-600">Keep this simple of 500 character</p>
                    </div>

                    <div className="grid min-w-full gap-1.5">
                        <Label htmlFor="tasks">Deliverables</Label>
                        <BulletPointTextarea />
                        <p className="text-xs text-gray-600">Keep this simple of 500 character</p>
                    </div>

                    <div className='flex items-center gap-6 pt-8'>
                        <Button type="button" variant={'outline'} className="border-primary text-xs text-primary w-2/5" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" className="bg-primary text-xs text-white w-full">
                            {initialData ? "Update Challenge" : "Create Challenge"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChallengeForm;
