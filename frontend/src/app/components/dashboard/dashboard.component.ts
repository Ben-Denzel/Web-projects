import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/Task/task.service';
import { AuthService } from '../../services/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  tasks: any[] = [];
  newTask = { title: '', description: '' };

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res: any) => (this.tasks = res),
      error: (err) => {
        console.error(err);
        this.router.navigate(['/login']);
      }
    });
  }

  createTask() {
    this.taskService.createTask(this.newTask).subscribe({
      next: () => {
        this.newTask = { title: '', description: '' };
        this.loadTasks();
      },
      error: (err) => alert('Failed to add task')
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => alert('Failed to delete task')
    });
  }

  editTask(task: any) {
    const updatedTitle = prompt('Edit Task Title:', task.title);
    if (updatedTitle !== null) {
      const updatedTask = { ...task, title: updatedTitle };
      this.taskService.updateTask(task._id, updatedTask).subscribe({
        next: () => this.loadTasks(),
        error: (err) => alert('Failed to update task')
      });
    }
  }

  logout() {
    this.authService.logout();
  }


}
