import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from 'src/app/interfaces/task.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { Person } from 'src/app/interfaces/person.interface';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  panelOpenState = false;
  currentDate = new Date();

  // Obtener los componentes de la fecha
  year = this.currentDate.getFullYear();
  month = String(this.currentDate.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan en 0, por lo que sumamos 1
  day = String(this.currentDate.getDate()).padStart(2, '0');

  // Construir la fecha en el formato deseado
  formattedDate = `${this.year}-${this.month}-${this.day}T00:00:00`;

  @Input() tasks?: Task[];
  @Input() persons?: Person[];
  @Input() assignedPersons?: Person[];
  @Output() taskIdSelected = new EventEmitter<number>();

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // Convertir las habilidades que sean strings JSON a arrays
    if (this.persons?.length) {
      this.persons!.forEach(person => {
        if (typeof person.skills === 'string') {
          // Convierte skills de string a un array si es un string JSON
          person.skills = JSON.parse(person.skills);
        } else if (!person.skills) {
          // Si no tiene habilidades, asigna un array vacío
          person.skills = [];
        }
      });
    }

  }

  isDeadlineGreaterOrEqual(deadLine: any): boolean {
    const deadlineDate = new Date(deadLine);
    const formattedDateObj = new Date(this.formattedDate);

    return deadlineDate >= formattedDateObj; // true si la fecha límite es mayor o igual a la fecha actual
  }

  ngOnChanges(changes: SimpleChanges) {
    // Este método se llamará cada vez que se detecte un cambio en los inputs
    if (changes['tasks']) {
      // Realiza cualquier acción necesaria cuando se detecten cambios en tasks
      console.log('Tasks updated:', this.tasks);
      this.cd.detectChanges(); // Fuerza la detección de cambios si es necesario
    }
  }

  getPersonsByTaskId(taskId: number) {
    this.taskIdSelected.emit(taskId);
  }


}
