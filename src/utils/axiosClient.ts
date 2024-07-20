import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class AxiosClient {
    private readonly axiosInstance: AxiosInstance;
    constructor(){
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:3000',
            headers: {
                "Content-Type": 'application/json'
            },
        })
    };

    public async GET<T>(config: AxiosRequestConfig): Promise<T>{
        try{
            return (await this.axiosInstance({...config, method: 'GET'})).data;
        } catch(error){
            throw error;
        }
    }

    public async POST<T, U>(config: AxiosRequestConfig, data: U): Promise<T>{
        try{
            return (await this.axiosInstance({...config, method: 'POST', data}));
        } catch(error){
            throw error;
        }
    }
}