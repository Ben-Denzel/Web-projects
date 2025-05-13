import { Component } from '@angular/core';
import { TaskService } from '../../services/Task/task.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  tasks: any[] = [];
  newTask = { title: '', description: '' };
  loading = false;

  constructor(
    private taskService : TaskService,
    private toastr : ToastrService
  ){}


  createTask() {
    this.loading = true;   // ✅ Start loader

    this.taskService.createTask(this.newTask).subscribe({
      next: (newTask) => {
        // Immediately add the new task to the local list
        this.tasks.push(newTask);
        this.newTask = { title: '', description: '' };
        this.toastr.success('Task created successfully!');
      },
      error: () => this.toastr.error('Failed to create task!'),
      complete: () => {
        this.loading = false;  // ✅ Stop loader
      }
    });
  }

}
