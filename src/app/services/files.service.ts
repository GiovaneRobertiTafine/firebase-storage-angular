import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileEntry, State } from '../models/fileentry.model';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MyFile } from '../models/my-file.model';

@Injectable({
    providedIn: 'root'
})
export class FilesService {

    private filesCollection: AngularFirestoreCollection<MyFile>;

    constructor(
        private storage: AngularFireStorage,
        private afs: AngularFirestore
    ) {
        this.filesCollection = afs.collection('myFiles', ref => ref.orderBy('date', 'desc'));
    }

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
        let newFileName = `${this.convertDate(new Date())}_${f.file.name}`;
        let path = `myFiles/${newFileName}`;
        f.task = this.storage.upload(path, f.file);
        // f.state = f.task.snapshotChanges()
        //     .pipe(
        //         map((s) => {
        //             f.percentage = ((s.bytesTransferred * 100) / s.totalBytes);
        //             return f.task.task.snapshot.state;
        //         }),
        //         catchError(s => {
        //             return of(f.task.task.snapshot.state);
        //         })
        //     );
        f.task.snapshotChanges()
            .pipe(
                tap(n => f.percentage = ((n.bytesTransferred * 100) / n.totalBytes)),
                finalize(() => {
                    if (f.state === 'success') {
                        this.filesCollection.add({
                            fileName: f.file.name, path: path, date: (new Date()).getTime(), size: f.file.size,
                        });
                    }
                })
            )
            .subscribe(
                (s) => {
                    f.bytesUploaded = s.bytesTransferred;
                    f.state = s.state as State;
                },
                (e) => {
                    f.state = f.task.task.snapshot.state as State;
                },
            );
        // this.fillAttributes(f);
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

    convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        return `${pad(inputFormat.getDate())}${pad(inputFormat.getMonth() + 1)}${inputFormat.getFullYear()}`;
    }

    getFiles(): Observable<MyFile[]> {
        return this.filesCollection.snapshotChanges()
            .pipe(map((actions) => {
                return actions.map(a => {
                    const file: MyFile = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    const url = this.storage.ref(file.path).getDownloadURL();
                    return { id, ...file, url };
                });
            }));
    }

    deleteFile(f: MyFile): void {
        this.storage.ref(f.path).delete();
        this.filesCollection.doc(f.id).delete();
    }


}
