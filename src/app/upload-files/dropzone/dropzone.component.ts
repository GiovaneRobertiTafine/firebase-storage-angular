import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-dropzone',
    templateUrl: './dropzone.component.html',
    styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit {
    isDragOver = false;
    @Output() droppedFiles = new EventEmitter<FileList>();

    constructor() { }

    ngOnInit(): void {
    }

    onDragOverEvent(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver = true;
    }

    onDreagLeaveEvent(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver = false;
    }

    onDropEvent(event: DragEvent): void {
        event.preventDefault();
        this.droppedFiles.emit(event.dataTransfer.files);
    }

}
