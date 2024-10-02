import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../interfaces/person.interface';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../environment/environtment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para crear una persona
  createPerson(person: Person): Observable<Person> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<Person>(this.apiUrl, person, { headers });
  }
}
