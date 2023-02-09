const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require ('./options')
const token = '6076479496:AAHpLcbSKZxFfEQ9GzJeDbD0m0pD_cQxzUY'

const bot = new TelegramApi(token, {polling: true})
//-----------------------------------------------------
// const fs = require('fs')
// const puppeteer = require('puppeteer')

// let link = 'https://www.dns-shop.ru/catalog/17a8a01d16404e77/smartfony/?p=';

// (async () => {

//     let flag = true
//     let res = []
//     let counter = 1

   
//         try {
        
//             let browser = await puppeteer.launch({
//                 headless: false,
//                 slowMo: 100,
//                 devtools: true
//             })
    
//             let page = await browser.newPage()
//             await page.setViewport({
//                 width:1400, height: 900
//             })
    
//             while (flag && (counter < 3) ) {
//                 await page.goto(`${link}${counter}`)
//                 await page.waitForSelector('a.pagination-widget__page-link_next')
//                 // console.log(counter);
    
//                 let html = await page.evaluate(async () => {
//                     let page = []
    
//                     try {
                        
//                         let divs = document.querySelectorAll('div.catalog-product')

                        
//                         divs.forEach (div => {
//                             let a = div.querySelector('a.catalog-product__name')
    
//                             let obj = {
//                                 // title: a !== null
//                                 //     ? a.innerText
//                                 //     : 'NO-LINK',
//                                 // link: a.href,
//                                 price: div.querySelector('div.product-buy__price') !== null
//                                         ? div.querySelector('div.product-buy__price').innerText 
//                                         : 'NO-PRICE'
//                             }
    
//                             page.push(obj)
                            

//                         })
    
//                     } catch (e) {
//                         console.log(e)
//                     }
    
//                     return page
//                 }, { waitUntil: 'a.pagination-widget__page-link_next' })
                
//                 await res.push(html)
                
//                 for (let i in res) {
//                     if (res[i].length === 0) flag = false
//                 }
                
//                 counter++
//             }
            
            
//             await browser.close()
            
//             res = res.flat()
            
//             fs.writeFile('dns.json', JSON.stringify({ 'data': res}), err => {
//                 if (err) throw err
//             })

//             start(JSON.stringify({ 'data': res}))
//             // start(res)
            
//         } catch (e) {
//             console.log(e);
//             await browser.close();
//         }
    
// }) ();


//----------------------------------------------------
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Загадаю цифру, отгадай`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Инфо'},
        {command: '/game', description: 'Игра в цифру'},

    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        // bot.sendMessage(chatId, res)
    
        if (text === '/start') {
            await bot.sendMessage(chatId, 'sticker')
            return bot.sendMessage(chatId, `Добро пожаловать`)
            // return bot.sendMessage(chatId, res)

        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
           return startGame(chatId);
        }

        return bot.sendMessage(chatId, `Я Тебя не понимать`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты неугадал, верная ${chats[chatId]}`, againOptions)
        }
        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        console.log(msg)
    })
}

start()