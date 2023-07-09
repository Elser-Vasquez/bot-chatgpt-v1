const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowPrincipal = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx, { endFlow, flowDynamic, provider }) => {
    
    await flowDynamic(
        `👋👋 Hola *${ctx.pushName}* Soy Un Agente Virtual de la laguna el Porvenir, hoy estaré a corgo de su atención`
    )  

  })
  .addAnswer(
      [
          'Escriba',
          '*1* : Para más *Información Turística*'
      ]
  )
  .addAnswer('Responda con el número de la opción!')  

module.exports = flowPrincipal;