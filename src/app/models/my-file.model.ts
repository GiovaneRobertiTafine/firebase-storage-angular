import { Observable } from "rxjs";

export interface MyFile {
    fileName: string;
    size: number;
    date: number;
    path: string;
    id?: string;
    url?: Observable<string>;
}