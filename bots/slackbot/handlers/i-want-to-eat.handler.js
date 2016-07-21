const MessageHandlerModel = require('../message-handler.model');
const messageFactoryService = require('../message-factory.service.js');

const places = [
    {
        title: 'пузата хата',
        link: "https://www.google.com.ua/maps/dir/''/%D0%91%D0%B0%D1%81%D0%B5%D0%B9%D0%BD%D0%B0+%D0%B2%D1%83%D0%BB.,+1%2F2,+Kiev/@50.4418721,30.521048,17.25z/data=!4m8!4m7!1m0!1m5!1m1!1s0x40d4ceff7934cd05:0xa98c3e2e128c5dae!2m2!1d30.5225358!2d50.4421333"
    },
    {
        title: 'сильпо',
        description: '-1 этаж gulliver',
        link: "https://www.google.com.ua/maps/dir/''/Sportyvna+Square,+1,+Kiev,+02000/@50.4381775,30.519403,16.75z/data=!4m8!4m7!1m0!1m5!1m1!1s0x40d4cefe31b5fb8f:0xbba259448e15f6ad!2m2!1d30.5231561!2d50.4387549"
    },
    {
        title: 'хинкали',
        link: "https://www.google.com.ua/maps/dir//%D0%A5%D0%B8%D0%BD%D0%BA%D0%B0%D0%BB%D0%B8+-+%D1%80%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD+%D0%B3%D1%80%D1%83%D0%B7%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B9+%D0%BA%D1%83%D1%85%D0%BD%D0%B8,+Shota+Rustaveli+St,+4,+Kiev,+01001/@50.4395847,30.5212854,17.5z/data=!4m9!4m8!1m0!1m5!1m1!1s0x40d4ceffaee65275:0xb56832dc52c0d3e3!2m2!1d30.52202!2d50.440095!3e2"
    }
];

module.exports = new MessageHandlerModel(/^\s*(обе(д|т)|dinner)/gi, (text, user, resp) => {
    messageFactoryService.sendFormattedMessage(resp, require('../message-formats/i-want-to-eat.message-format'), places);
});
