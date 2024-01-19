import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Todo } from '../models/todo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private http = inject(HttpClient)
  private readonly url = 'http://localhost:3000/todo'

  getTodos(): Observable<Todo[]>{
    return this.http.get<Todo[]>(this.url);
  }

  createTodos(todo: Todo) { return this.http.post(this.url, todo); }
  updateTodos(todo: Todo) { return this.http.put(`${this.url}/${todo.id}`, todo); }
  deleteTodos(id: string) { return this.http.delete(`${this.url}/${id}`); }

}
