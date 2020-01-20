import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserIdComponent } from "./user-id/user-id.component";

const routes: Routes = [
    {
        path: '',
        component: UsersComponent,
        data: {
            title: 'Users'
        }
    },
    {
        path: ':id/edit', 
        component: UserIdComponent,
        data: {
            title: 'User edit'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }

