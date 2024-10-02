import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate, Task } from '../interfaces/task.interface';
import { environment } from '../environment/environtment';

@Injectable({
  providedIn: 'root'
})
export class TodoListApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // GET: Obtener todos los TODOs y Paginar con el scroll
  getTodos(page: number, limit: number): Observable<Paginate> {
    return this.http.get<Paginate>(`${this.apiUrl}Tasks?page=${page + 1}&limit=${limit}&sortBy=TaskId&order=desc`);

  }

  // GET: Obtener un TODO por ID
  getTodoById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // POST: Crear un nuevo TODO
  createTodo(todo: Task): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Task>(`${this.apiUrl}Tasks/create`, todo, { headers });
  }

  // PATCH: Actualizar parcialmente un TODO por ID
  patchTodo(id: number, changes: Task): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, changes, { headers });
  }

  // PUT: Reemplazar completamente un TODO por ID
  putTodo(id: number, updatedTodo: Task): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Task>(`${this.apiUrl}/${id}`, updatedTodo, { headers });
  }
}
