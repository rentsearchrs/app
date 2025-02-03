import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './page/main-page/main-page.component';
import { ProductDatailComponent } from './page/product-datail/product-datail.component';
import { ItemSearchComponent } from './website/item-search/item-search.component';
import { ItemPageComponent } from './website/item-page/item-page.component';
import { MainPageWebsiteComponent } from './website/main-page-website/main-page-website.component';
import { TeamComponent } from './website/team/team.component';
import { WorkComponent } from './website/work/work.component';
import { ContactComponent } from './website/contact/contact.component';
import { AboutComponent } from './website/about/about.component';
import { CliningComponent } from './website/clining/clining.component';
import { BuildingPlanHomeComponent } from './website/building-plan-home/building-plan-home.component';
import { AdminPageComponent } from './rieltor_admin/admin-page/admin-page.component';
import { AgentDashboardComponent } from './rieltor_admin/agent-dashboard/agent-dashboard.component';
import { OrderRieltorAdminComponent } from './rieltor_admin/order-rieltor-admin/order-rieltor-admin.component';
import { TeamLeaderComponent } from './rieltor_admin/team-leader/team-leader.component';
import { CreateRieltorComponent } from './rieltor_admin/create-rieltor/create-rieltor.component';
import { CreateRequastComponent } from './owner_bot/create-requast/create-requast.component';
import { StatisticComponent } from './rieltor_admin/statistic/statistic.component';
import { StatisticTeamLeadComponent } from './rieltor_admin/statistic-team-lead/statistic-team-lead.component';
import { OrderTeamLeadComponent } from './rieltor_admin/order-team-lead/order-team-lead.component';
import { ChanelControlComponent } from './page/chanel-control/chanel-control.component';

const routes: Routes = [
  {path:'main', component:MainPageComponent, pathMatch:'full'},
  {path:'detalis', component:ProductDatailComponent, pathMatch:'full'},
  {path:'product', component:ItemSearchComponent, pathMatch:'full'},
  {path:'item/:id', component:ItemPageComponent, pathMatch:'full'},
  {path:'main-page', component:MainPageWebsiteComponent, pathMatch:'full'},
  {path:'team', component:TeamComponent, pathMatch:'full'},
  {path:'work', component:WorkComponent, pathMatch:'full'},
  {path:'contacts', component:ContactComponent, pathMatch:'full'},
  {path:'about', component:AboutComponent, pathMatch:'full'},
  {path:'clining', component:CliningComponent, pathMatch:'full'},
  {path:'building/plan/home', component:BuildingPlanHomeComponent, pathMatch:'full'},
  { path: '', redirectTo: '/main-page', pathMatch: 'full' }, // Redirect root to main page
  {path: 'login', component:AdminPageComponent, pathMatch:'full'},
  { path: 'dashboard', component: AgentDashboardComponent, pathMatch:'full'},
  {path:'order', component: OrderRieltorAdminComponent, pathMatch:'full'},
  {path:'teamlead', component:TeamLeaderComponent, pathMatch:'full'},
  {path:'create_rieltor', component:CreateRieltorComponent, pathMatch:'full'},
  {path:'owner_bot', component:CreateRequastComponent, pathMatch:'full'},
  {path:'statistic', component:StatisticComponent, pathMatch:'full'}, 
  {path:'statistic_team_lead', component:StatisticTeamLeadComponent, pathMatch:'full'}, 
  {path:'order_team_lead', component:OrderTeamLeadComponent, pathMatch:'full'}, 
  {path:'chanel_control', component:ChanelControlComponent, pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
