import { Component, OnInit } from '@angular/core';
import { FileEntry } from '../models/fileentry.model';
import { FilesService } from '../services/files.service';

@Component({
    selector: 'app-upload-files',
    templateUrl: './upload-files.component.html',
    styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {

    files: FileEntry[] = [];

    constructor(private filesService: FilesService) { }

    ngOnInit(): void {
    }

    onDropFiles(files: FileList): void {
        this.files.splice(0, this.files.length);
        for (let index = 0; index < files.length; index++) {
            // this.filesService.onDropFiles(files.item(index));
            this.files.push({
                file: files.item(index),
                percentage: null,
                uploading: null,
                bytesUploaded: null,
                canceled: null,
                error: null,
                finished: null,
                paused: null,
                state: null,
                task: null
            });
        }
    }

    removeFileFromList(i): void {
        this.files.splice(i, 1);
    }

    uploadAll() {
        for (let index = 0; index < this.files.length; index++) {
            this.filesService.upload(this.files[index]);
        }
    }

}
