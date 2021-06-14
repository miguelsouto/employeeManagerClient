import { EmployeeService } from './employee.service';
import { Employee } from './employee';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;
  public showConfirmMessage: boolean = false;
  public showErrorMessage: boolean = false;

  constructor(
    private employeeService: EmployeeService,
  ){}

  ngOnInit() {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        this.showErrorMessage = true;
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('close-add-model').click();
    this.employeeService.addEmployees(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
        this.showConfirmMessage = true;
      },
      (error: HttpErrorResponse) => {
        this.showErrorMessage = true;
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void {
    document.getElementById('close-edit-model').click();
    console.log(employee)
    console.log(this.editEmployee)
    this.employeeService.updateEmployees(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        this.showConfirmMessage = true;
      },
      (error: HttpErrorResponse) => {
        this.showErrorMessage = true;
      }
    );
  }

  public onDeleteEmployee(employeeId: number): void {
    document.getElementById('close-delete-model').click();
    this.employeeService.deleteEmployees(employeeId).subscribe(
      (response: void) => {
        this.getEmployees();
        this.showConfirmMessage = true;
      },
      (error: HttpErrorResponse) => {
        this.showErrorMessage = true;
      }
    );
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    for(const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          results.push(employee);
      }
    }
    this.employees = results;
    if(!key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if(mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if(mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }

  public hideMessage(): void {
    this.showConfirmMessage = false;
    this.showErrorMessage = false;
  }
}
