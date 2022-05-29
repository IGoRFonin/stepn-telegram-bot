import TelegramApi from 'node-telegram-bot-api';
import { v4 } from 'uuid';
import { addHours, formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale/index.js';
import dotenv from 'dotenv';
import {
    START_MESSAGE,
    MENU_COMMANDS,
    KEYBOARD_COMMANDS,
    LVLUP_COMMANDS,
    LVL_PREFIX,
    ONE_HOUR,
    LVL_RESET_COMMANDS, RESET_ALL, TEST_TIMER
} from './constants.js';
import { declOfNum } from "./utils.js";

dotenv.config();

const TOKEN = process.env.TOKEN;

const bot = new TelegramApi(TOKEN, { polling: true });

const users = {};

bot.on('message', msg => {
    const userId = msg.chat.id;
    const msgDate = new Date(msg.date * 1000);

    if (msg.text === '/start') {
        bot.sendMessage(userId, START_MESSAGE, {
            reply_markup: JSON.stringify({
                keyboard: MENU_COMMANDS
            })
        });
    }

    if (msg.text === KEYBOARD_COMMANDS.LVL_UP) {
        bot.sendMessage(userId, 'Выбери нужный уровень', {
            reply_markup: JSON.stringify({
                inline_keyboard: LVLUP_COMMANDS
            })
        });
    }

    if (msg.text === KEYBOARD_COMMANDS.CURRENT) {
        const userData = users[userId];

        if (userData && Object.keys(userData.lvlups).length > 0) {
            bot.sendMessage(userId, `
            Ваши повышения: \n${Object.values(userData.lvlups).map(
                lvl => `${lvl.lvl} уровень будет повышен ${formatDistance(lvl.endAt, msgDate, { locale: ru, addSuffix: true })}`
            ).join('\n')} 
            `);

            return;
        }

        bot.sendMessage(userId, `На данный момент повышений нету.`);
    }

    if (msg.text === KEYBOARD_COMMANDS.RESET) {
        bot.sendMessage(userId, 'Вы уверены?', {
            reply_markup: JSON.stringify({
                inline_keyboard: LVL_RESET_COMMANDS
            })
        });
    }
});

bot.on('callback_query', (msg) => {
    const userId = msg.message.chat.id;

    if (msg.data.search(LVL_PREFIX) !== -1) {
        const lvl = Number(msg.data.replace(LVL_PREFIX, ''));
        const uuid = v4();
        bot.sendMessage(userId, `Таймер добавлен на ${lvl} ${declOfNum(lvl, ['час', 'часа', 'часов'])}.` );

        const timer = setTimeout(() => {
            bot.sendMessage(userId, `Уровень ${lvl} повышен.`);
            delete users[userId].lvlups[uuid];
        }, lvl * ONE_HOUR);

        const createDate = new Date(msg.message.date * 1000);
        users[userId] = users[userId] || {lvlups: {}};
        users[userId].lvlups[uuid] = {
            lvl,
            timer,
            createAt: createDate,
            endAt: addHours(createDate, lvl)
        };
    }

    if (msg.data === RESET_ALL) {
        if (!users[userId] || Object.keys(users[userId].lvlups).length === 0) {
            bot.sendMessage(userId, `У вас пока нет повышений.`);
            return;
        }

        const uuidKeys = Object.keys(users[userId].lvlups);

        uuidKeys.forEach(key => {
            clearTimeout(users[userId].lvlups[key].timer);
        });

        users[userId].lvlups = {};

        bot.sendMessage(userId, `Ваши повышения обнулились.`);
    }

    if (msg.data === TEST_TIMER) {
        bot.sendMessage(userId, `Добавление таймер на 10 секунд.`);
        setTimeout(() => {
            bot.sendMessage(userId, `Уведомление через 10 секунд.`);
        }, 1000 * 10);
    }
})

bot.on('polling_error', error => console.log(error))
