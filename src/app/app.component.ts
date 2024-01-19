import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Todo } from './models/todo';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  todoService = inject(TodoService);

  title = 'ToDoApp';
  todosList = signal<Todo[]>([]);

  description = new FormControl('', [Validators.required, Validators.minLength(4)]);

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos() {
    this.todoService.getTodos().subscribe({
      next: (todos: Todo[]) => {
        this.todosList.set(todos);
      },
      error: (err: any) => {
        console.log(err);
      }
    });

  }

  deleteTodo(id: string) {
    this.todoService.deleteTodos(id).subscribe({
      next: () => {
        this.getTodos();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  toggleDoneTodo(todo: Todo) {
      todo.done = !todo.done;
      this.todoService.updateTodos(todo).subscribe({
        next: () => {
          this.getTodos();
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }

  addTodo() {
    const todo = this.createTodo();
    if (!todo || this.description.value?.trim() === '') {
      return;
    }
    this.todoService.createTodos(todo!).subscribe({
      next: () => {
        this.getTodos();
        this.description.reset();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  createTodo() {
    if (this.description.invalid) {
      return;
    }
    const todo: Todo = {
      id: String(this.IdUnic()) ,
      description: this.description.value as string,
      done: false
    }
    return todo;
  }

  avgPrecetTodoDone() {
    const todos = this.todosList();
    const totalTodos = todos.length;
    const totalDoneTodos = todos.filter(todo => todo.done).length;
    const avg = totalDoneTodos / totalTodos * 100;
    return avg ? Math.floor(avg) : 0;
  }

  IdUnic() {
    return Math.floor(Math.random() * Date.now());
  }

}
