import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ChallengeProps {
    challenge: {
        title: string;
        image: string;
        skills: string[];
        seniority: string;
        timeline: string;
    };
}

export default function ChallengeCard({ challenge }: ChallengeProps) {
    return (
        <div className="border rounded-md w-fit h-fit">
            <div className="p-3">
                <Image
                    src={challenge.image}
                    alt={challenge.title}
                    className="object-cover"
                    height={160}
                    width={270}
                />
                <p
                    className="text-sm font-semibold my-6 max-w-[270px]"
                    title={challenge.title}
                >
                    {challenge.title}
                </p>
                <p className="text-xs font-semibold">Skills Needed:</p>
                <div className="flex flex-wrap mt-1 gap-2 max-w-[270px]">
                    {challenge.skills.map((skill, index) => (
                        <Badge key={index} variant="card1" className="text-primary">
                            {skill}
                        </Badge>
                    ))}
                </div>
                <div className="text-xs mt-2 max-w-[270px]">
                    <span className="font-semibold">Seniority Level: </span>
                    <span className="text-gray-600">{challenge.seniority}</span>
                </div>
                <div className="text-xs mt-2 max-w-[270px]">
                    <span className="font-semibold">Timeline: </span>
                    <span className="text-gray-600">{challenge.timeline}</span>
                </div>
            </div>
            <div className="border-t p-3">
                <Button className='bg-primary text-white text-xs py-0'>View Challenge</Button>
            </div>
        </div>
    );
}
