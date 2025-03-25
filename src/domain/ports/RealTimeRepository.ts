export interface IRealTimeRepository {
    emit(event: string, data: any): void;
} 