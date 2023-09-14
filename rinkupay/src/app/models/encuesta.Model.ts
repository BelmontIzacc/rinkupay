/**
 * @autor Belmont
 * @date 07/03/2020
 */

/**
  * @description modelo para el uso de información de la encuesta dentro del sistema
  * 
*/

export class Encuesta{

    //contructor que instancia la información del modelo con la informacion de la encuesta
    constructor( folio: String, periodo: String, tramite: String, departamento: String, preguntas : any, comentarios: String){
        this.folio = folio;
        this.periodo = periodo;
        this.tramite = tramite;
        this.departamento = departamento;
        this.preguntas = preguntas;
        this.comentarios = comentarios;
        this.fecha = new Date();
    }

    'folio' : String; //folio de la encuesta registrada
    'periodo' : String; // periodo en el cual se registro la encuesta
    'tramite' : String; //tramite en el cual se contesta la encuesta
    'departamento' : String; // departamento pertenesiente de la encuesta contestada
    'fecha' : Date; //fecha en la cual se contesto la encuesta
    'preguntas' : []; //respuestas de la encuesta
    'comentarios' : String; //comentarios registrados en caso de existir de la encuesta

    //funcion para el control de tiempos da dormato de 07/03/2020
    formatTime( today: Date ){

        var options = { year: 'numeric', month: '2-digit', day: '2-digit' };

        let actual = today.toLocaleDateString("es-ES", options); 

        return actual;

    }

     //funcion para el control de tiempos da dormato de 07/03/2020
     getformatTime(){

        var options = { year: 'numeric', month: '2-digit', day: '2-digit' };

        let actual = this.fecha.toLocaleDateString("es-ES", options); 

        return actual;

    }

    /**
     * 
     * 
day:
    The representation of the day.
    Possible values are "numeric", "2-digit".
weekday:
    The representation of the weekday.
    Possible values are "narrow", "short", "long".
year:
    The representation of the year.
    Possible values are "numeric", "2-digit".
month:
    The representation of the month.
    Possible values are "numeric", "2-digit", "narrow", "short", "long".
hour:
    The representation of the hour.
    Possible values are "numeric", "2-digit".
minute: 
    The representation of the minute.
    Possible values are "numeric", "2-digit".
second:
    The representation of the second.
    Possible values are "numeric", 2-digit".
     * 
     * 
     */
}