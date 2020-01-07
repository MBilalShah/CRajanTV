export class Tutorial {
    id: string;
    title: string;
    practiceVideoPath: Array<VideoLoopModel>;
    videoPaths: Array<VideoLoopModel>;
    stops:number=0;
    totalStops:number;
}

export class VideoLoopModel {
    src: string;
    totalCount: number;
    currentCount: number;
    shouldPause:boolean;
}
