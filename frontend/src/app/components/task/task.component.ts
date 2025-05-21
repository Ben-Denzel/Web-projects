import { Component } from '@angular/core';
import { TaskService } from '../../services/Task/task.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification/notification.service';



@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  tasks: any[] = [];
  newTask = { title: '', description: '',category:'' };
  loading = false;

  constructor(
    private taskService : TaskService,
    private toastr : ToastrService,
    private notificationService : NotificationService
  ){}


  createTask() {
    this.loading = true;

    this.taskService.createTask(this.newTask).subscribe({
      next: (newTask) => {
        this.notificationService.notify('New task Created!')
        this.tasks.push(newTask);
        this.newTask = { title: '', description: '', category:'' };
        this.toastr.success('Task created successfully!');
      },
      error: () => this.toastr.error('Failed to create task!'),
      complete: () => {
        this.loading = false;
      }
    });
  }

}
