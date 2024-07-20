import { AddExerciseBody } from '@/components/exercises/add-exercise-dialog';
import { BodyParts } from '@/db/schema';
import { AxiosClient } from '@/utils/axiosClient';

const axiosClient = new AxiosClient();

export async function getBodyParts(): Promise<{data:BodyParts[]}>{
    return await axiosClient.GET({url: '/api/body-parts'});
}

export async function addExercise(data: AddExerciseBody): Promise<void> {
    return await axiosClient.POST<void, AddExerciseBody>({url: '/api/exercise'}, data);
}