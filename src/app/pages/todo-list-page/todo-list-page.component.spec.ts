import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListPageComponent } from './todo-list-page.component';

describe('TodoListPageComponent', () => {
  let component: TodoListPageComponent;
  let fixture: ComponentFixture<TodoListPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoListPageComponent]
    });
    fixture = TestBed.createComponent(TodoListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
