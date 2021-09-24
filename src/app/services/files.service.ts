import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileEntry } from '../models/fileentry.model';
import { map, catchError, finalize } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FilesService {

    constructor(private storage: AngularFireStorage) { }

    onDropFiles(f: File) {
        let path = `myFiles/${f.name}`;
        let task = this.storage.upload(path, f);
        task.snapshotChanges()
            .subscribe(
                (s) => {
                    console.log(s);
                }
            );
    }

    upload(f: FileEntry) {
        let newFileName = `${(new Date()).getTime()}_${f.file.name}`;
        let path = `myFiles/${newFileName}`;
        f.task = this.storage.upload(path, f.file);
        f.state = f.task.snapshotChanges().pipe((map(s => s.state)));
        f.state = f.task.snapshotChanges()
            .pipe(
                map((s) => f.task.task.snapshot.state),
                catchError(s => {
                    return of(f.task.task.snapshot.state);
                })
            );
        // f.task.snapshotChanges()
        //     .subscribe(
        //         (s) => {
        //             if (s.state === "running") {
        //                 f.uploading = of(true);
        //             }
        //         },

        //     );
        this.fillAttributes(f);
    }

    fillAttributes(f: FileEntry) {
        f.percentage = f.task.percentageChanges();
        f.uploading = f.state.pipe(map((s) => s == "running"));
        f.finished = from(f.task).pipe(map((s) => s.state == "success"));
        f.paused = f.state.pipe(map((s) => s == "paused"));
        f.error = f.state.pipe(map((s) => s == "error"));
        f.canceled = f.state.pipe(map((s) => s == "canceled"));
        f.bytesUploaded = f.task.snapshotChanges().pipe((map(s => s.bytesTransferred)));
    }
}
