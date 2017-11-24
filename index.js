//Declaracion de constantes
const Telegraf = require('telegraf');
//token obtenido desde el bot Botfather
const Token ="400306593:AAEyaKiq4Drg1cF4xZvAqycmazma0MbBd4A";
//dependencias del valenbisi
const Geolib = require('geolib');
const ObtenerEstaciones = require('get-json');

const bot = new Telegraf(Token);
const bikes = 'https://api.citybik.es/v2/networks/valenbisi?fields=stations'

bot.command('start', (ctx) => {
    var nombre = ctx.from.first_name;
    ctx.reply('Hola, ' + nombre);
});

bot.on('location', (ctx) => {
    var location = ctx.message.location;
    //ctx.reply('Estas en:' + JSON.stringify(location) + '!');

    ObtenerEstaciones(bikes,function(error,resultado){
        //calculamos la estacion mas cercana [location],[listado de location destinos],indice que buscamos en orden de lejania
        var masCercana = Geolib.findNearest(location, resultado.network.stations,0);
        var indice = masCercana.key;
        var estacion = resultado.network.stations[indice];

        var latitud = estacion.latitude;
        var longitud = estacion.longitude;
        var direccion = estacion.extra.address;
        var huecos = estacion.empty_slots;
        var bicis = estacion.free_bikes;
        ctx.replyWithLocation(latitud,longitud).then(
            ctx.reply('Dirección: ' + direccion)
        );
        //ctx.reply(JSON.stringify(estacion));
    });
});



console.log('Iniciando Alberginabot, weee!!!');
bot.startPolling();