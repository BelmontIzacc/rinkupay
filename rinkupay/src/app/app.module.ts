
/**
 * @autor Belmont
 * @date 13/09/2023
 */

/**
  * @description modulos requeridos dentro del sistema
  * para su funcionamiento
  * 
*/

/** Modulos para el movimiento dentro del sistema y cambio del titulo */
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/** componentes del sistema */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Error404Component } from './components/error404/error404.component';
import { LoginComponent } from './components/login/login.component';
import { GraciasComponent } from './components/gracias/gracias.component';
import { MainUserComponent } from './components/user/main-user/main-user.component';
import { DialogInfoComponent } from './components/user/dialog-info/dialog-info.component';

/** modulos para validacion y peticiones http */
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/** modulos de los componentes de angular material */
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { DialogComponent } from './components/user/dialog/dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

/** 
 * declarando los modulos para su uso dentro del sistema por medio de variables
 * globales
 */
@NgModule({
  declarations: [
    AppComponent,
    Error404Component,
    LoginComponent,
    GraciasComponent,
    MainUserComponent,
    DialogComponent,
    DialogInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    MatSnackBarModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    BrowserAnimationsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTableDataSource,
    MatPaginator,
  ],
  providers: [Title, MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
