import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private URL = 'https://task-manager-backend-hu0f.onrender.com/api/tasks';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('token') : null;
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getTasks() {
    return this.http.get(this.URL, { headers: this.getAuthHeaders() });
  }

  createTask(task: any) {
    return this.http.post(this.URL, task, { headers: this.getAuthHeaders() });
  }

  updateTask(id: string, task: any) {
    return this.http.put(`${this.URL}/${id}`, task, { headers: this.getAuthHeaders() });
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.URL}/${id}`, { headers: this.getAuthHeaders() });
  }
}
