import { AngularFireUploadTask } from "@angular/fire/storage";
import { Observable, Subscription } from "rxjs";

export interface FileEntry {
    file: File;
    task: AngularFireUploadTask;
    percentage: number;
    // uploading: Observable<boolean>;
    // finished: Observable<boolean>;
    // paused: Observable<boolean>;
    // error: Observable<boolean>;
    // canceled: Observable<boolean>;
    bytesUploaded: number;
    state: State;
}

export type State = 'running' | 'success' | 'paused' | 'error' | 'canceled';