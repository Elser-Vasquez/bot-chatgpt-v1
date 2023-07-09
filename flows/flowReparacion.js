const { addKeyword } = require("@bot-whatsapp/bot");
//const { getUser, getTicket } = require("../api/users.service");
const { readFileSync } = require("fs");
const { join } = require("path");
const delay = (ms) => new Promise((res =>  setTimeout(res, ms)))

/**
 * Recuperamos el prompt "TECNICO"
 */
const getPrompt = async () => {
  const pathPromp = join(process.cwd(), "promps");
  const text = readFileSync(join(pathPromp, "01_TECNICO.txt"), "utf-8");
  return text;
};

/**
 * Exportamos
 * @param {*} chatgptClass
 * @returns
 */
module.exports = {
  flowReparacion: (chatgptClass) => {
    return addKeyword("1", {
      sensitive: true,
    })
      .addAction(async (ctx, { endFlow, flowDynamic, provider }) => {
        await flowDynamic("...");   //CONSIULTANDO BASE DE DATOS

        const jid = ctx.key.remoteJid
        const refProvider = await provider.getInstance()

        await refProvider.presenceSubscribe(jid)
        await delay(500)

        await refProvider.sendPresenceUpdate('composing', jid)


        //const user = await getUser(ctx.from);//Consultamos a strapi! ctx.from = numero
        const user = 2342;
        //const lastTicket = await getTicket(user[0].id);
        const lastTicket = {'data':'12345'}

        if (!lastTicket.data.length) {
          await flowDynamic("No tienes Entrada Registrada!");
          return endFlow();
        }

        const listTickets = lastTicket.data
     

        const data = await getPrompt();

        await chatgptClass.handleMsgChatGPT(data);//Diciendole actua!!    promp inicial de instrucciones

        const textFromAI = await chatgptClass.handleMsgChatGPT(                 //promp de informacion adicional
          `cliente=${ctx.pushName}`
        );


        await flowDynamic(textFromAI.text);
      })
      .addAnswer(
        `-->`,
        { capture: true },
        async (ctx, { fallBack, endFlow, flowDynamic }) => {
          // ctx.body = es lo que la peronsa escribe!!
          if(!ctx.body.toLowerCase().includes('salir')){
              const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body);
              await fallBack(textFromAI.text);
          }else{
            await flowDynamic("Gracias por su visita");
            endFlow();
          }
        }
      );
  },
};
