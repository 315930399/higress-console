import request from './request';
import { Consumer } from '@/interfaces/consumer';
import { PageQuery } from '@/interfaces/common';

export const getConsumers = (): Promise<Consumer[]> => {
  return request.get<any, Consumer[]>('/v1/consumers');
};

export interface ConsumerPageResponse {
  data: Consumer[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export const getConsumersPage = (query: PageQuery): Promise<ConsumerPageResponse> => {
  return request.get<any, ConsumerPageResponse>('/v1/consumers', {
    params: query,
    __rawResponse: true,
  } as any);
};

export const addConsumer = (payload: Consumer): Promise<any> => {
  return request.post<any, any>('/v1/consumers', payload);
};

export const deleteConsumer = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/consumers/${name}`);
};

export const updateConsumer = (payload: Consumer): Promise<any> => {
  return request.put<any, any>(`/v1/consumers/${payload.name}`, payload);
};
