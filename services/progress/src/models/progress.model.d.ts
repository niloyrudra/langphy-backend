export interface ProgressData {
    user_id: string;
    content_type: string;
    content_id: string;
    completed: boolean;
    progress_percent: number;
}
export declare class ProgressModel {
    static upsertProgress(data: ProgressData): Promise<any>;
    static getUserProgress(userId: string): Promise<any[]>;
}
//# sourceMappingURL=progress.model.d.ts.map