export interface IDatabaseInitializer {
	init(): Promise<void>;
	disconnect(): Promise<void>;
}