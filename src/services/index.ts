import { BodyParts } from '@/db/schema';
import { AxiosClient } from '@/utils/axiosClient';
import axios from 'axios';

const axiosClient = new AxiosClient();

export async function getBodyParts(): Promise<{data:BodyParts[]}>{
    return await axiosClient.GET({url: '/api/body-parts'});
}