import { AddExerciseBody } from '@/components/exercises/add-exercise-dialog';
import { DeleteExerciseData } from '@/components/exercises/delete-exercise-dialog';
import { UpdateExerciseBody } from '@/components/exercises/update-exercise-dialog';
import { BodyParts, Exercises } from '@/db/schema';
import { AxiosClient } from '@/utils/axiosClient';

const axiosClient = new AxiosClient();

export async function getBodyParts(): Promise<{data:BodyParts[]}>{
    return await axiosClient.GET({url: '/api/body-parts'});
}

export async function addExercise(data: AddExerciseBody): Promise<void> {
    return await axiosClient.POST<void, AddExerciseBody>({url: '/api/exercise'}, data);
}

export async function deleteExercise(data: DeleteExerciseData): Promise<void>{
    return await axiosClient.DELETE({url: `/api/exercise/${data.exerciseId}`})
}

export async function updateExercise(exerciseId: number, data: UpdateExerciseBody): Promise<void>{
    return await axiosClient.PATCH({url: `/api/exercise/${exerciseId}`}, data)
}