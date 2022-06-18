
const TicketControl = require('../models/ticket-control') 

const ticketControl = new TicketControl; // Creo instancia de la clase y llamo a sus metodos

// Todo esto se carga el socket, este controllador hara lo suyo de una vez
const socketController = (socket) => {
    
    // Cuando un cliente se conecta. Se mandan eventos, hay que escucharlos
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length)

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        // Notificar que hay un nuevo ticket pendiente de asignar
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
    })

    // Escucha al evento atender ticket, envia objeto y maneja el callback
    socket.on('atender-ticket', ({escritorio}, callback) => {
        
        socket.emit('estado-actual', ticketControl.ultimos4);

        if(!escritorio){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        // Creo el ticket. Viene de la clase ticketControl, metodo atenderTicket, trae escritorio con param
        const ticket = ticketControl.atenderTicket(escritorio);

        // Hago las notificaciones con los broadcast cuando se ha asignado tickets
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.emit('tickets-pendientes', ticketControl.tickets.length)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)

        if(!ticket){
            callback({
                ok: false,
                msg: 'No hay tickets pendientes'
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }

    })


}


module.exports = {
    socketController
}

