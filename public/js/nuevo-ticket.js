// Referencias HTML

const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

const socket = io();



socket.on('connect', () => {
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});


socket.on('enviar-mensaje', (payload) => {
    console.log( payload )
})

socket.on('ultimo-ticket', (ultimo) => {
    document.getElementById('lblNuevoTicket').innerHTML = `Ticket  ${ultimo}`
})


btnCrear.addEventListener( 'click', () => {
    
    socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerText = ticket;
    });

});