import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TaskComponent } from 'src/app/components/task/task.component';
import { TodoListApiService } from 'src/app/services/todo-list-api.service';
import { Paginate, Task } from 'src/app/interfaces/task.interface';
import { catchError, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterTaskComponent } from 'src/app/components/register-task/register-task.component';
import { Person } from 'src/app/interfaces/person.interface';
import { TaskPersonService } from 'src/app/services/task-person.service';

@Component({
  selector: 'app-todo-list-page',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    TaskComponent,
    HttpClientModule,
    MatDialogModule
  ],
  templateUrl: './todo-list-page.component.html',
  styleUrls: ['./todo-list-page.component.scss']
})
export class TodoListPageComponent {

  todoList: Task[] = [];
  originalTodoList: Task[] = [];
  private page: number = 0;
  private limit: number = 10;
  loading: boolean = false;
  task!: Task;
  listPersons: Person[] = [];

  constructor(private todoListService: TodoListApiService, public getPersonByTaskId: TaskPersonService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos() {
    if (this.loading) return; // Evitar múltiples cargas
    this.loading = true;

    this.todoListService.getTodos(this.page, this.limit).pipe(
      catchError(err => {
        console.error(err);
        return of({ totalCount: 0, page: this.page, limit: this.limit, tasks: [] });
      })
    ).subscribe({
      next: (response: Paginate) => {
        console.log('response', response)
        this.todoList = [...this.todoList, ...response.tasks]; // Agrega nuevos elementos a la lista existente
        this.originalTodoList = [...this.todoList];
        this.page++; // Incrementa la página para la próxima carga
        this.loading = false;
      },
      error: (err) => {
        alert('Error: ' + err);
        this.loading = false;
      }
    });
  }

  filterTasks(filterType: string) {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    switch (filterType) {
      case 'all':
        this.todoList = [...this.originalTodoList]; // Restablece a la lista original
        break;
      case 'completed':
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1); // Un día antes de hoy
        yesterday.setHours(0, 0, 0, 0); // Ajusta a las 00:00:00

        this.todoList = this.originalTodoList.filter(task =>
          task.deadLine && new Date(task.deadLine).toDateString() === yesterday.toDateString()
        );
        break;
      case 'pending':
        this.todoList = this.originalTodoList.filter(task =>
          task.deadLine && new Date(task.deadLine) >= startOfToday // Incluye tareas de hoy y futuras
        );
        break;
      default:
        this.todoList = [...this.originalTodoList]; // Por defecto, muestra todas las tareas
    }
  }


  getPersonById(taskId: number) {
    this.getPersonByTaskId.getPersonsByTaskId(taskId).pipe(
      catchError(err => {
        console.error(err);
        return of([]);
      })
    ).subscribe({
      next: (response: Person[]) => {
        const updatedPersons = response.map(person => {
          if (typeof person.skills === 'string') {
            person.skills = (person.skills as string).split(',').map(skill => skill.trim());
          } else if (!Array.isArray(person.skills)) {
            person.skills = []; // Asegúrate de que sea un array si no es string ni array
          }
          return person;
        });

        this.todoList.forEach(task => {
          if (task.taskId === taskId) {
            task.persons = updatedPersons; // Asigna la respuesta a la tarea
          }
        });

        this.todoList = [...this.todoList]; // Propaga los cambios
        console.log('Personas actualizadas', this.todoList);
      },
      error: (err) => {
        alert('Error: ' + err);
      }
    })
  }

  // Escuchar el evento de scroll
  @HostListener('window:scroll', [])
  onScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;

    const documentHeight = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);

    const windowBottom = windowHeight + window.pageYOffset >= documentHeight;

    if (windowBottom) {
      this.getTodos(); // Cargar más tareas cuando se llegue al final
    }
  }

  newTask(): void {
    const dialogTask = this.dialog.open(RegisterTaskComponent);

    dialogTask.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.task = result;
      this.getTodos()
    });
  }

}