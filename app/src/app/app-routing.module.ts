import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListItemsComponent } from './list-items/list-items.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { UpdateItemComponent } from './update-item/update-item.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  { path: '', component: ListItemsComponent },
  { path: 'create-item', component: CreateItemComponent },
  { path: 'update-item', component: UpdateItemComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'list', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
