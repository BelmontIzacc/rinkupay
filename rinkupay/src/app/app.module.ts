
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
import { EntregasComponent } from './components/entregas/entregas.component';
import { MainUserComponent } from './components/user/main-user/main-user.component';
import { EditarComponent } from './components/user/editar/editar.component';
import { MensajeDialog } from './components/user/mensaje/mensaje.component';
import { ReporteComponent } from './components/user/reporte/reporte.component';
import { EditarEntregaComponent } from './components/user/editarEntrega/editarEntrega.component';

/** modulos para validacion y peticiones http */
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/** import para enviar token al realizar una peticion */
import { AuthInterceptor } from './guard/auth.interceptor';
import { ErrorInterceptor } from './guard/ErrorInterceptor';

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
import { AgregarComponent } from './components/user/agregar/agregar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

/** 
 * declarando los modulos para su uso dentro del sistema por medio de variables
 * globales
 */
@NgModule({
  declarations: [
    AppComponent,
    Error404Component,
    LoginComponent,
    EntregasComponent,
    MainUserComponent,
    AgregarComponent,
    EditarComponent,
    MensajeDialog,
    ReporteComponent,
    EditarEntregaComponent
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
    MatRadioModule
  ],
  providers: [Title, MatDatepickerModule, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES', // Cambia 'es-ES' al locale que desees
    }, {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      }
    },],
  bootstrap: [AppComponent],
})
export class AppModule { }
