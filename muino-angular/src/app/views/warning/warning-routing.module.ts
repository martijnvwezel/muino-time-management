import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarningComponent } from './warning.component';


const routes: Routes = [
    {
        path: '',

        component: WarningComponent,
        data: {
            title: 'Warning'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WarningRoutingModule { }
