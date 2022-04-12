import { AngularFireUploadTask } from "@angular/fire/storage";
import { Observable, Subscription } from "rxjs";

export interface FileEntry {
    file: File;
    task: AngularFireUploadTask;
    // percentage: Observable<number>;
    percentage: number;
    uploading: Observable<boolean>;
    finished: Observable<boolean>;
    paused: Observable<boolean>;
    error: Observable<boolean>;
    canceled: Observable<boolean>;
    // bytesUploaded: Observable<number>;
    bytesUploaded: number;
    // state: Observable<string>;
    state: State;
}

export type State = 'running' | 'success' | 'paused' | 'error' | 'canceled';