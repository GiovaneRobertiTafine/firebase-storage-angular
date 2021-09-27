import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileEntry, State } from '../models/fileentry.model';
import { map, catchError, finalize, tap } from 'rxjs/operators';
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
        // f.state = f.task.snapshotChanges()
        //     .pipe(
        //         map((s) => f.task.task.snapshot.state),
        //         catchError(s => {
        //             return of(f.task.task.snapshot.state);
        //         })
        //     );
        // f.state = f.task.snapshotChanges().subscribe()
        // f.state = f.task.snapshotChanges().pipe(map(s => s.state));
        f.task.snapshotChanges()
            .pipe(tap(n => f.percentage = ((n.bytesTransferred * 100) / n.totalBytes)))
            .subscribe(
                (s) => {
                    f.bytesUploaded = s.bytesTransferred;
                    f.state = s.state as State;
                },
                (e) => {
                    f.state = f.task.task.snapshot.state as State;
                },
            );
        this.fillAttributes(f);
    }

    fillAttributes(f: FileEntry) {
        // f.percentage = f.task.percentageChanges();
        // f.uploading = f?.state.pipe(map((s) => s == "running"));
        // f.finished = from(f.task).pipe(map((s) => s.state == "success"));
        // f.paused = f?.state.pipe(map((s) => s == "paused"));
        // f.error = f?.state.pipe(map((s) => s == "error"));
        // f.canceled = f?.state.pipe(map((s) => s == "canceled"));
        // f.bytesUploaded = f.task.snapshotChanges().pipe((map(s => s.bytesTransferred)));
    }
}
