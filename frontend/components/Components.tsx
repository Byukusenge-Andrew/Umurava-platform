"use client"; // Needed if using Next.js App Router (app directory)

import { FileText, MoveLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setRole, type AuthState } from "@/lib/features/authentication/authSlice";
import { formatTitle } from "@/lib/utils";


export const ChallengeButton = ({ id, title }: { id: number; title: string }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const role = useSelector((state: { auth: AuthState }) => state.auth.role);

  useEffect(() => {
    if (pathname.includes("admin")) {
      dispatch(setRole("admin"));
    } else {
      dispatch(setRole("talent"));
    }
  }, [pathname, dispatch]);

  const formattedTitle = formatTitle(title);
  const href = role === "admin" ? `/admin/challenges/${id}/${formattedTitle}` : `/talent-challenges/${id}/${formattedTitle}`;

  return (
    <Button className="bg-primary text-white text-xs py-0">
      <Link href={href}>View Challenge</Link>
    </Button>
  );
};


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

export const MetricCard = ({ title, amount }: { title: string; amount: number }) => {
  return (
    <div className="bg-white flex justify-between items-center w-full border border-gray-200 rounded-md py-6 px-3">
      {/* Left Section */}
      <div className="flex text-sm gap-2">
        <div className="w-1 bg-primary rounded-lg"></div>
        <div>
          <p className="text-gray-600">{title}</p>
          <p className="font-bold">{amount}</p>
        </div>
      </div>

      {/* Right Section - Icon */}
      <div className="bg-blue-100 flex justify-center items-center rounded-full w-fit p-2">
        <FileText className="text-primary h-5 w-5" />
      </div>
    </div>
  );
};

export const FilterTab = ({ tab, label, count }: { tab: string; label: string; count: number }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = searchParams.get("tab") || "all";
  const isActive = currentTab === tab;

  const handleClick = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    router.push(`/talent-challenges?${newParams.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-fit flex items-center gap-2 text-sm border rounded-md p-3 transition ${isActive ? "bg-blue-100 border-[#FCD2C2]" : "bg-gray-100  border-gray-200"
        }`}
    >
      <FileText className="text-gray-400 h-4 w-4" />
      <p>{label}</p>
      <p className={`${isActive ? "bg-primary text-white" : "bg-gray-200"} rounded-full px-2`}>{count}</p>
    </button>
  );
};
