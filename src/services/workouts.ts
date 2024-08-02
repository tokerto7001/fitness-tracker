import { AxiosClient } from "@/utils/axiosClient";

const axiosClient = new AxiosClient();

export async function getWorkouts(): Promise<void>{
    return await axiosClient.GET({url: `/api/workouts`});
}