// Referncias html

const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes')


const searchParams = new URLSearchParams(window.location.search); // Para verificar los parametros 

if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

divAlerta.style.display = 'none'


const escritorio = searchParams.get('escritorio');
lblEscritorio.innerHTML = escritorio;


const socket = io();

// Se escuchan los eventos y se hace algo //

// Habilitar/Deshabilitar el boton segun conexion con server 
socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});


socket.on('enviar-mensaje', (payload) => {
    console.log( payload )
})

socket.on('ultimo-ticket', (ultimo) => {
    // document.getElementById('lblNuevoTicket').innerHTML = `Ticket ${ultimo}`
})

socket.on('tickets-pendientes', (pendientes) =>{
    lblPendientes.innerText = pendientes
})

btnAtender.addEventListener( 'click', () => {

    socket.emit('atender-ticket', {escritorio}, ({ok, ticket}) =>{
        
        if(!ok){
            lblTicket.innerText = "nadie";
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ${ticket.numero}`;


    })



});
