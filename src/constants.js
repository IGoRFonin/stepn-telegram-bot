import {createListFromIndex} from "./utils.js";

export const START_MESSAGE = 'Добро пожаловать, я помогу тебе проще следить за прокачкой уровней в STEP\'N.'
export const KEYBOARD_COMMANDS = {
    LVL_UP: 'LVL UP',
    CURRENT: 'Current raises',
    RESET: 'Reset'
};
export const MENU_COMMANDS = [
    [{ text: KEYBOARD_COMMANDS.LVL_UP }],
    [
        { text: KEYBOARD_COMMANDS.CURRENT },
        { text: KEYBOARD_COMMANDS.RESET }
    ],
];

export const LVL_PREFIX = 'lvl_';
export const ONE_HOUR = 60 * 60 * 1000;
export const RESET_ALL = 'reset_all';
export const TEST_TIMER = 'TEST_TIMER';

export const LVLUP_COMMANDS = [
    createListFromIndex(1).map(text => ({ text, callback_data: `${LVL_PREFIX}${text}`})),
    createListFromIndex(7).map(text => ({ text, callback_data: `${LVL_PREFIX}${text}`})),
    createListFromIndex(13).map(text => ({ text, callback_data: `${LVL_PREFIX}${text}`})),
    createListFromIndex(19).map(text => ({ text, callback_data: `${LVL_PREFIX}${text}`})),
    createListFromIndex(25).map(text => ({ text, callback_data: `${LVL_PREFIX}${text}`})),
    [{ text: 'Проверить таймер через 10 секунд', callback_data: TEST_TIMER }]
];

export const LVL_RESET_COMMANDS = [
  [{ text: 'Да', callback_data: RESET_ALL }]
];
