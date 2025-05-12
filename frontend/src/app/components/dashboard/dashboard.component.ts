import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/Task/task.service';
import { AuthService } from '../../services/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];
  newTask = { title: '', description: '' };
  loading = false;  // ✅ ADD THIS

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;   // ✅ Start loader
    this.taskService.getTasks().subscribe({
      next: (res: any) => {
        this.tasks = res;
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/login']);
      },
      complete: () => {
        this.loading = false;  // ✅ Stop loader
      }
    });
  }

  createTask() {
    this.loading = true;   // ✅ Start loader

    this.taskService.createTask(this.newTask).subscribe({
      next: (newTask) => {
        // Immediately add the new task to the local list
        this.tasks.push(newTask);
        this.newTask = { title: '', description: '' };  // Clear form
      },
      error: (err) => {
        alert('Failed to add task');
      },
      complete: () => {
        this.loading = false;  // ✅ Stop loader
      }
    });
  }


  deleteTask(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    this.loading = true;   // ✅ Start loader

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        // Immediately remove the deleted task from local tasks list
        this.tasks = this.tasks.filter(task => task._id !== id);
      },
      error: (err) => {
        console.error('Error deleting task:', err);  // Log detailed error to the console
        alert('Failed to delete task');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;  // ✅ Stop loader
      }
    });
  }



  editTask(task: any) {
    const updatedTitle = prompt('Edit Task Title:', task.title);
    if (updatedTitle !== null) {
      const updatedTask = { ...task, title: updatedTitle };

      this.loading = true;   // ✅ Start loader

      this.taskService.updateTask(task._id, updatedTask).subscribe({
        next: () => {
          // Update the task locally without re-fetching
          this.tasks = this.tasks.map(t => t._id === task._id ? updatedTask : t);
        },
        error: (err) => {
          alert('Failed to update task');
        },
        complete: () => {
          this.loading = false;  // ✅ Stop loader
        }
      });
    }
  }


  logout() {
    this.authService.logout();
  }
}
