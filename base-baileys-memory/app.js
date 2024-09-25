const { createBot, createProvider, createFlow, addKeyword,EVENTS} = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { appendToSheet} = require("./utils")
const { delay } = require('@whiskeysockets/baileys')
const path =require("path")
const fs =require("fs")

const menuPath = path.join(__dirname, 'mensajes', 'menu.txt')
const menu = fs.readFileSync(menuPath, 'utf8').split('\n')

const precPath = path.join(__dirname, 'mensajes', 'Precios.txt')
const precio = fs.readFileSync(precPath, 'utf8')

const flowInicio = addKeyword(['hola','Hola','Buen dia','Buenos Dias','Buenos dias','Buenos dias ','buenos dias','Buenas tardes','Buenas tardes ','Buenas Tardes','buenas'])
    .addAnswer('🤖 Hola, soy el asistente virtual *OZONBOT* te ayudare para que agendes el alquier del generador de ozono.🤖\n' ) 
    
    .addAnswer('Estoy para que conozcas las ventajas del generador de *OZONO*\n',{
        media:'https://m.media-amazon.com/images/I/71ulAic25CL._AC_SL1500_.jpg',
    })
    .addAnswer('Para iniciar escribe *Menu* para explorar todas las opciones disponibles en nuestro chat.\n')

const flowMenuAction = addKeyword(EVENTS.ACTION)
    .addAnswer('1. Información sobre ques es un generador de OZONO.: https://ozonohogar.com/blog/usos-de-un-generador-de-ozono-en-el-hogar/ \n',{
        media:'https://ozonohogar.com/blog/wp-content/uploads/2023/01/usos-un-generador-de-ozono-en-tu-hogar.jpg'
    })
   .addAnswer('\n🛟En cualquier momento, escribe "menú" para volver al inicio.')

const flowMenuInfo = addKeyword(EVENTS.ACTION)
    .addAnswer(precio,{
        media:'https://m.media-amazon.com/images/I/71ulAic25CL._AC_SL1500_.jpg'}
    )
    .addAnswer('\n La mejor opcion para tus espacios y mejorar tu calidad de vida.',{
        media:'https://m.media-amazon.com/images/I/81jUA2ZNfjL._AC_SL1500_.jpg'
    }
    )
    //.addAnswer('💼 Estas son los precios que tenemos disponebles para que puedas escoger el que mejor se adapte a tus necesidades. ✏️ \n ')
    //.addAnswer('⌛ 1 Hr Apto 50 mtrs2 con domicilio   | $ 15.000')
    //.addAnswer('⏰ 1 Hr Casa 60 mtrs2 con domicilio   | $ 20.000')
    //.addAnswer('⏱️ 1 Hr LocalComerciales con domicilio| $ 35.000')
    //.addAnswer('⏲️ 40min Carro particular a domicilio | $ 40.000')
    //.addAnswer('🕰️ 45min serv público a domicilio     | $ 50.000')
    //.addAnswer('\n Por favor, identifique número de servicio que más le interese en el menú opción 3 puede indicar el numero.')
    //.addAnswer('\n 🛟 En cualquier momento, escribe "menú" para volver al inicio.')
    .addAnswer('\n🛟En cualquier momento, escribe *menú* para volver al inicio.')
const flowPrincipal = addKeyword(EVENTS.ACTION)
//const flowPrincipal = addKeyword(['Agendar'])
.addAnswer('🙌 Hola aqui puedes agendar el aquiler del generador de *OZONO*', null, async (ctx, ctxFn) => {
    const senderName = ctx.pushName || 'Usuario';
    const senderPhone = ctx.from || 'numero usuario';
    const interactionTime = new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' });
    await ctxFn.state.update({ senderName, senderPhone, interactionTime});
})

.addAnswer("Nombre: ", {capture: true},
    async(ctx,ctxFn) => {
        await ctxFn.state.update({name: ctx.body})
    }
)
.addAnswer("Direción: ", {capture: true},
    async(ctx,ctxFn) => {
        await ctxFn.state.update({address: ctx.body})
    }
)
.addAnswer('💼 Estas son los precios que tenemos disponebles para que puedas escoger el que mejor se adapte a tus necesidades. ✏️ \n ')
.addAnswer(precio)

.addAnswer("Que opcion necesitas? ", {capture: true},
    async(ctx,ctxFn) => {
        await ctxFn.state.update({amount: ctx.body})
    }
)
.addAnswer("*Fecha la que necesitas el servico:* ", {capture: true},
    async(ctx,ctxFn) => {
        await ctxFn.state.update({category: ctx.body})
    }
)
.addAnswer("*Hora en la que necesitas el servico:* ", {capture: true},
    async(ctx,ctxFn) => {
        await ctxFn.state.update({categoryH: ctx.body})
    }
)
.addAnswer("🏁Gracias tus datos fueron registrados con exito🏁", null,
    async(ctx,ctxFn) => {
        const senderName =ctxFn.state.get("senderName")||'Usuario'
        const senderPhone = ctxFn.state.get("senderPhone")||ctx.from||'numero desconocido'
        const name = ctxFn.state.get("name")
        const address = ctxFn.state.get("address")
        const amount = ctxFn.state.get("amount")
        const category= ctxFn.state.get("category")
        const categoryH= ctxFn.state.get("categoryH")
        const interactionTime = ctxFn.state.get("interactionTime")
        await appendToSheet ([senderName,senderPhone,name,address, amount, category,categoryH,interactionTime])
    }
)
.addAnswer('\n\n✌️¡Hemos recibido tu información!🤘\n')
.addAnswer('🫶 Procederemos con el agendamiento y, si necesitamos más detalles, nos pondremos en contacto.👋')
.addAnswer('💌 *¡Gracias!* Escribe "menú" para volver al inicio. 🪄 ')


const menuFlow = addKeyword('menu','Menú ','menú').addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
    if (!["1", "2", "3","0"].includes(ctx.body)) {
        return fallBack(
        "Respuesta no válida, por favor selecciona una de las opciones."
        );
    }
    switch (ctx.body) {
        case "1":
            return gotoFlow(flowMenuAction);
        case "2":
            return gotoFlow(flowMenuInfo);
        case "3":
            return gotoFlow(flowPrincipal);
        case "0":
            return await flowDynamic(
            "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu"
            );
        }
    }
);
const main = async () => {
    try{
        const adapterDB = new MockAdapter()
        const adapterFlow = createFlow([flowInicio,flowPrincipal,menuFlow,flowMenuAction,flowMenuInfo])
        const adapterProvider = createProvider(BaileysProvider)

        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        })

        QRPortalWeb()
    }catch (error) {
        console.error('Error en la fundacion principal:',error)
    }
}

main().catch(error => console.error('error al ejecutar main:',error))
