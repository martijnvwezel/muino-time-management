import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectidComponent } from "./projectid/projectid.component";
import { ProjectnewComponent } from "./projectnew/projectnew.component";
import { TasknewComponent } from "./tasknew/tasknew.component";

import { EditprojectComponent } from "./editproject/editproject.component";
import { EdittaskComponent } from "./edittask/edittask.component";

const routes: Routes = [
    {
        path: '',
        component: ProjectComponent,
        data: {
            title: 'Project Component'
        },
    },
    {
        path: 'new',
        component: ProjectnewComponent,
        data: {
            title: 'Projectnew Component'
        }
    },
    {
        path: 'task/:id/new', 
        component: TasknewComponent,
        data: {
            title: 'Task new Component'
        }
    },
    {
        path: 'task/:id/edit',
        component: EdittaskComponent,
        data: {
            title: 'Edit task Component'
        }
    },
    {
        path: ':id',// always last 
        component: ProjectidComponent,
        data: {
            title: 'Project id Component' // shows list of tasks
        }
    },
    {
        path: ':id/edit',// always last 
        component: EditprojectComponent,
        data: {
            title: 'Edit project Component' // shows list of tasks
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule { }
