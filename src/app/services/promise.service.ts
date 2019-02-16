import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient, HttpEvent } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class PromiseService {

    constructor(private httpService: HttpService) { }
    get(url: string, type: string) {
        var promise = new Promise((resolve, reject) => {

            this.httpService.get(url, type).subscribe((res: any) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
        return promise;
    }

    post(url: string, type: string, data: any) {

        var promise = new Promise((resolve, reject) => {
            this.httpService.post(url, type, data).subscribe((res: any) => {
                resolve(res);
            }, (err) => {
                reject(err)
            });
        });
        return promise;
    }

    put(url: string, type: string, data: any) {

        var promise = new Promise((resolve, reject) => {
            this.httpService.put(url, type, data).subscribe((res: any) => {
                resolve(res);
            }, (err) => {
                reject(err)
            });
        });
        return promise;
    };


    delete(url: string, type: string) {
        var promise = new Promise((resolve, reject) => {
            this.httpService.delete(url, type).subscribe((res: any) => {
                resolve(res);
            }, (err) => {
                reject(err)
            });
        });
        return promise;
    };
}