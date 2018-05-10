import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WebDataService {

  constructor(public http: HttpClient) { }


  getUser(id) {
    return new Promise(resolve => {
      this.http.get('https://app.wista.cz/api/v1/mon/users/'+id+'/orders').subscribe(data => {
        resolve(data);
      }, (err) => {
        console.log(err);
      });
    });
  }

}
