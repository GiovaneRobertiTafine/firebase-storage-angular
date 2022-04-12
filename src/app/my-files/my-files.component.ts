import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MyFile } from '../models/my-file.model';
import { FilesService } from '../services/files.service';

@Component({
    selector: 'app-my-files',
    templateUrl: './my-files.component.html',
    styleUrls: ['./my-files.component.scss']
})
export class MyFilesComponent implements OnInit {

    files: Observable<MyFile[]>;

    constructor(private fileService: FilesService) { }

    ngOnInit(): void {
        this.files = this.fileService.getFiles();
    }

    delete(f: MyFile): void {
        this.fileService.deleteFile(f);
    }

}
