import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Task } from 'src/app/interfaces/task.interface';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Skill } from 'src/app/interfaces/skills.interface';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Person } from 'src/app/interfaces/person.interface';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskComponent } from '../task/task.component';
import { TodoListApiService } from 'src/app/services/todo-list-api.service';
import { TaskPersonService } from 'src/app/services/task-person.service';

@Component({
  selector: 'app-register-task',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    NgIf,
    ReactiveFormsModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatChipsModule,
    MatListModule,
    MatSnackBarModule,
    TaskComponent,
    MatDialogModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
  ],
  templateUrl: './register-task.component.html',
  styleUrls: ['./register-task.component.scss']
})
export class RegisterTaskComponent {

  registerTaskForm!: FormGroup;
  personForm!: FormGroup;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  skills: String[] = ['FrontEnd', 'BackEnd', 'Scrumm'];
  announcer = inject(LiveAnnouncer);
  associatePerson: Person[] = []
  taskToRegister!: Task;

  constructor(
    public dialogRef: MatDialogRef<RegisterTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private createTask: TodoListApiService,
    private assignedPerson: TaskPersonService
  ) { }

  ngOnInit(): void {
    this.registerTaskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      deadLine: ['', [Validators.required]]
    });

    this.personForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      age: ['', [Validators.required, Validators.minLength(2), Validators.min(18)]]
    })
  }

  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date !== null && date >= today;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
 
    if (value) {
      this.skills.push(value);
    }
 
    event.chipInput!.clear();
  }

  remove(skill: String): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);

      this.announcer.announce(`Removed ${skill}`);
    }
  }

  edit(skill: String, event: MatChipEditedEvent) {
    const value = event.value.trim();
 
    if (!value) {
      this.remove(skill);
      return;
    }
 
    const index = this.skills.indexOf(skill);
    if (index >= 0) {
      this.skills[index] = value;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  associate() {
    const dataPerson: Person = this.personForm.value
    console.log(dataPerson)

    if (this.skills.length === 0) {
      this.openSnackBar('La persona a asignar debe tener por lo menos 1 habilidad', 'ok');
      return; // Salir de la función si no hay habilidades
    }


    const filterPerson = this.associatePerson.filter(x => x.fullName === dataPerson.fullName);
    console.log('filterPerson', filterPerson)

    console.log('que pasa en dataperson', dataPerson)

    if (!filterPerson.length) {
      dataPerson.skills = [...(this.skills as [])];
      this.associatePerson.push(dataPerson) 
    } else { 
      this.openSnackBar('esta persona ya éxiste', 'ok')
    }
    console.log('que se esta guardando en persona', this.associatePerson)
  }

  saveAndClose() {    
    this.taskToRegister = this.registerTaskForm.value;
    this.taskToRegister.persons = [...this.associatePerson];

    const taskTodo: Task = {};
    const personAssign: Person[] = [];

    taskTodo.title = this.taskToRegister.title
    taskTodo.deadLine = this.taskToRegister.deadLine
 

    personAssign.push(...this.taskToRegister.persons);

    const convertedData = personAssign.map((person: any) => ({
      ...person,
      skills: person.skills.join(', ') // Join skills array into a string
    }));
 

    this.createTask.createTodo(taskTodo).subscribe({
      next: (response: Task) => { 
        const taskId = response.taskId;
        this.openSnackBar('Task created', 'ok');
        convertedData.map((person: Person) => {
          person.taskId = taskId
        })

        console.log('personas a asignar', convertedData)
 
        this.assignedPerson.addPersonToTask(convertedData as Person[]).subscribe({
          next: (assignResponse) => {
            console.log('Personas asignadas con éxito:', assignResponse);
            this.openSnackBar('Personas asignadas con éxito a la tarea', 'ok');
            this.dialogRef.close(this.taskToRegister);
          },
          error: (error) => {
            console.error('Error en la asignación de personas:', error);
            this.openSnackBar('Error en la asignación de personas', 'ok');
          }
        });
      },
      error: (error) => {
        console.error('Error al crear la tarea:', error);
        this.openSnackBar('Error al crear la tarea', 'ok');
      }
    });
 
  }

}
