export const getChallenge = async (id: number, creator_id: string | null) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/challenges/id/${id}/${creator_id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching challenges:", error);
        return [];
    }
};

export const getChallenges = async (limit = 5) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/challenges/${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching challenges:", error);
        return [];
    }
};
