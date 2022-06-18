const path = require('path');
const fs   = require('fs');

class Ticket {

    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }

}

class TicketControl {

    constructor(){
        this.ultimo   = 0;
        this.hoy      = new Date().getDate(); 
        this.tickets  = [];
        this.ultimos4 = [];

        this.init();
    }

    // Formatea para pasarlo al JSON
    get toJson(){ // Al llamar toJson del TicketControl, se va a generar este objeto
        return{
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init(){ // Inicializa la class
        const {hoy, tickets, ultimo, ultimos4} = require('../db/data.json')
        if( hoy === this.hoy ){ // Es hoy, recargo data segun json
            this.tickets  = tickets;
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            // Es otro dia
            this.guardarDB();
        }
    }

    guardarDB(){ // Grabamos en JSON

        const dbPath = path.join( __dirname, '../db/data.json');
        fs.writeFileSync( dbPath, JSON.stringify(this.toJson))
    }

    siguiente(){ // Asignar siguiente ticket
        this.ultimo += 1; // Ultimo ticket +1
        const ticket = new Ticket(this.ultimo, null); // Asigno numero y escritorio al ticket
        this.tickets.push(ticket); // Meto este ticket en el array de tickets 

        this.guardarDB();
        return 'Ticket' + ticket.numero;
    }

    atenderTicket( escritorio){ //Atender los tickets

        // No tenemos tickets
        if(this.tickets.length === 0){
            return null
        }

        const ticket = this.tickets.shift(); // Agarro el primer ticket y lo quito de la lista
        ticket.escritorio = escritorio;


        this.ultimos4.unshift(ticket); // Meto el ticket al inicio de los ultimos 4

        if (this.ultimos4.length > 4){
            this.ultimos4.splice(-1, 1);
        }

        this.guardarDB();
        
        return ticket;



    }



}

module.exports = TicketControl // Exporto la clase
                               // Esta clase llama al metodo Init y lee el json