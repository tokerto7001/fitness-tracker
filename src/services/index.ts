import { AddExerciseBody } from '@/components/exercises/add-exercise-dialog';
import { DeleteExerciseData } from '@/components/exercises/exercise-card';
import { BodyParts } from '@/db/schema';
import { AxiosClient } from '@/utils/axiosClient';

const axiosClient = new AxiosClient();

export async function getBodyParts(): Promise<{data:BodyParts[]}>{
    return await axiosClient.GET({url: '/api/body-parts'});
}

export async function addExercise(data: AddExerciseBody): Promise<void> {
    return await axiosClient.POST<void, AddExerciseBody>({url: '/api/exercise'}, data);
}

export async function deleteExercise(data: DeleteExerciseData){
    return await axiosClient.DELETE({url: `/api/exercise/${data.exerciseId}`})
}