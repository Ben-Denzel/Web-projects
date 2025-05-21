import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/Task/task.service';
import { ActivatedRoute, Router } from '@angular/router';


import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];
  newTask = { title: '', description: '', category:'' };
  loading = false;  // ✅ ADD THIS

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route : ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('token', token);
        // Navigate to the actual dashboard
        this.router.navigate(['/dashboard']);
      }
    });
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
        this.newTask = { title: '', description: '',category:'' };
        this.toastr.success('Task created successfully!');
      },
      error: () => this.toastr.error('Failed to create task!'),
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
        this.toastr.info('Task was deleted successfully!');

      },
      error: (err) => {
        console.error('Error deleting task:', err);  // Log detailed error to the console
        this.toastr.error('Failed to delete task!');
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
          this.toastr.success('Task updated successfully!');
        },
        error: (err) => {
          this.toastr.success('Failed to update task');
        },
        complete: () => {
          this.loading = false;  // ✅ Stop loader
        }
      });
    }
  }

}
