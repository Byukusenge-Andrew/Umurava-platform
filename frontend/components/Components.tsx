"use client"; // Needed if using Next.js App Router (app directory)

import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const GoBackButton = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="p-1.5 border w-fit border-gray-200 rounded-lg flex items-center gap-2 hover:border-primary transition"
        >
            <MoveLeft className="w-3 h-3 text-gray-600" />
        </button>
    );
};

export const StepIndicator = ({ number, text }: { number: number; text: string }) => {
    return (
        <div className="flex items-center gap-2">
            <p className="w-8 h-8 bg-primary text-white font-bold rounded-full border border-black flex items-center justify-center">
                {number}
            </p>
            <p className="text-sm text-gray-600">{text}</p>
        </div>
    );
};
