import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../interfaces/person.interface';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../environment/environtment';

@Injectable({
  providedIn: 'root'
})
export class TaskPersonService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para asociar una persona a una tarea
  addPersonToTask(person: Person[]): Observable<Person[]> {
    const url = `${this.apiUrl}Tasks/createPersons`; // URL simulada
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<Person[]>(url, person, { headers });
  }

  // Método para obtener las personas asociadas a una tarea
  getPersonsByTaskId(taskId: number): Observable<Person[]> {
    const url = `${this.apiUrl}Tasks/${taskId}/persons`; // URL simulada
    return this.http.get<Person[]>(url);
  }
}
