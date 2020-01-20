import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrikklokComponent } from './prikklok.component';


const routes: Routes = [
    {
        path: '',
        component: PrikklokComponent,
        data: {
            title: 'Prikklok Component'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrikklokRoutingModule { }
