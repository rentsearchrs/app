import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './page/main-page/main-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ProductDatailComponent } from './page/product-datail/product-datail.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ApplyTemplatePipe } from './apply-template.pipe';
import { ItemSearchComponent } from './website/item-search/item-search.component';
import { NavbarComponent } from './website_plagin/navbar/navbar.component';
import { FooterComponent } from './website_plagin/footer/footer.component';
import { ImageSliderComponent } from './website_plagin/image-slider/image-slider.component';
import { ItemPageComponent } from './website/item-page/item-page.component';
import { SwiperPersonComponent } from './website_plagin/swiper-person/swiper-person.component';
import { MainPageWebsiteComponent } from './website/main-page-website/main-page-website.component';
import { TeamComponent } from './website/team/team.component';
import { TeamSegmentedControlComponent } from './website_plagin/team-segmented-control/team-segmented-control.component';
import { MainSliderComponent } from './website_plagin/main-slider/main-slider.component';
import { WorkComponent } from './website/work/work.component';
import { ContactComponent } from './website/contact/contact.component';
import { AboutComponent } from './website/about/about.component';
import { CliningComponent } from './website/clining/clining.component';
import { BuildingPlanHomeComponent } from './website/building-plan-home/building-plan-home.component';
import { AdminPageComponent } from './rieltor_admin/admin-page/admin-page.component';
import { AroundComponent } from './website_plagin/around/around.component';
import { TelegramAfishaComponent } from './website_plagin/telegram-afisha/telegram-afisha.component';
import { AgentDashboardComponent } from './rieltor_admin/agent-dashboard/agent-dashboard.component';
import { FormOrderComponent } from './website_plagin/form-order/form-order.component';
import { NavbarRieltorAdminComponent } from './rieltor_admin_plagin/navbar-rieltor-admin/navbar-rieltor-admin.component';
import { CommonModule } from '@angular/common';
import { OrderRieltorAdminComponent } from './rieltor_admin/order-rieltor-admin/order-rieltor-admin.component';
import { TeamLeaderComponent } from './rieltor_admin/team-leader/team-leader.component';
import { NavbarTeamleedAdminComponent } from './rieltor_admin_plagin/navbar-teamleed-admin/navbar-teamleed-admin.component';
import { CreateRieltorComponent } from './rieltor_admin/create-rieltor/create-rieltor.component';
import { CreateRequastComponent } from './owner_bot/create-requast/create-requast.component';
import { StatisticComponent } from './rieltor_admin/statistic/statistic.component';
import { ChanelControlComponent } from './page/chanel-control/chanel-control.component';
import { StatisticTeamLeadComponent } from './rieltor_admin/statistic-team-lead/statistic-team-lead.component';
import { OrderTeamLeadComponent } from './rieltor_admin/order-team-lead/order-team-lead.component';
import { NavbarOwnerComponent } from './page/navbar-owner/navbar-owner.component';
import { ShablonPageComponent } from './page/shablon-page/shablon-page.component';



@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ProductDatailComponent,
    ApplyTemplatePipe,
    ItemSearchComponent,
    NavbarComponent,
    FooterComponent,
    ImageSliderComponent,
    ItemPageComponent,
    SwiperPersonComponent,
    MainPageWebsiteComponent,
    TeamComponent,
    TeamSegmentedControlComponent,
    MainSliderComponent,
    WorkComponent,
    ContactComponent,
    AboutComponent,
    CliningComponent,
    BuildingPlanHomeComponent,
    AdminPageComponent,
    AroundComponent,
    TelegramAfishaComponent,
    AgentDashboardComponent,
    FormOrderComponent,
    NavbarRieltorAdminComponent,
    OrderRieltorAdminComponent,
    TeamLeaderComponent,
    NavbarTeamleedAdminComponent,
    CreateRieltorComponent,
    CreateRequastComponent,
    StatisticComponent,
    StatisticTeamLeadComponent,
    ChanelControlComponent,
    OrderTeamLeadComponent,
    NavbarOwnerComponent,
    ShablonPageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,  
    HttpClientModule,
    DragDropModule,
    CommonModule,
    ReactiveFormsModule,
    BaseChartDirective,
  ],
  providers: [
    provideClientHydration(),
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
