import { GetExercisesQueryParams } from '@/app/(root)/page';
import { AddExerciseBody } from '@/components/exercises/add-exercise-dialog';
import { DeleteExerciseData } from '@/components/exercises/delete-exercise-dialog';
import { UpdateExerciseBody } from '@/components/exercises/update-exercise-dialog';
import { Exercises } from '@/db/schema';
import { AxiosClient } from '@/utils/axiosClient';

const axiosClient = new AxiosClient();

export async function addExercise(data: AddExerciseBody): Promise<void> {
    return await axiosClient.POST<void, AddExerciseBody>({url: '/api/exercises'}, data);
}

export async function deleteExercise(data: DeleteExerciseData): Promise<void>{
    return await axiosClient.DELETE({url: `/api/exercises/${data.exerciseId}`})
}

export async function updateExercise(exerciseId: number, data: UpdateExerciseBody): Promise<void>{
    return await axiosClient.PATCH({url: `/api/exercises/${exerciseId}`}, data)
}

export async function getExercises(data: GetExercisesQueryParams): Promise<{data: Exercises[] }>{
    return await axiosClient.GET({url: `/api/exercises`, params: data})
}