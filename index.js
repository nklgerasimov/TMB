const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require ('./options')
const token = '6076479496:AAHpLcbSKZxFfEQ9GzJeDbD0m0pD_cQxzUY'

const bot = new TelegramApi(token, {polling: true})

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
        // const photo = 'C:\Users\nkl\Desktop\1.bmp';
        // const protect_content = true;
        // bot.sendMessage(chatId, res)
    
        if (text === '/start') {
            // await bot.sendPhoto(chatId, '1.jpg')
            return bot.sendMessage(chatId, `Добро пожаловать`)
            // return bot.sendMessage(chatId, res)

        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
           return startGame(chatId);
        }

        if (text === '/foto') {
           return bot.sendPhoto(chatId, '1.jpg', {protect_content: true})
        }

        return bot.sendMessage(chatId, `Я Тебя не понимать`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты неугадал, верная ${chats[chatId]}`, againOptions)
        }
        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        console.log(msg)
    })
}

start()