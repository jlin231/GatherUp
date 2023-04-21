'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'EventImages';
const { Event } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const events = await Event.findAll();

    function getId(array, num) {
      return array[num - 1].id;
    };
    const data = [
      {
        eventId: getId(events, 1),
        url: "https://photoresources.wtatennis.com/photo-resources/2019/08/15/dbb59626-9254-4426-915e-57397b6d6635/tennis-origins-e1444901660593.jpg?width=1200&height=630",
        preview: false
      },
      {
        eventId: getId(events, 4),
        url: "https://img.olympicchannel.com/images/image/private/t_s_w960/t_s_16_9_g_auto/f_auto/primary/ufqgtgmmdvwrcqavdrhw",
        preview: true
      },
      {
        eventId: getId(events, 3),
        url: "http://cdn.akc.org/content/hero/cute_puppies_hero.jpg",
        preview: true
      },
      {
        eventId: getId(events, 2),
        url: "https://img.hoodline.com/2021/11/levi_s_concert-1.webp?h=400&w=930&fit=crop&crop=faces,center",
        preview: false
      },
      {
        eventId: getId(events, 2),
        url: "https://img.hoodline.com/2021/11/levi_s_concert-1.webp?h=400&w=930&fit=crop&crop=faces,center",
        preview: false
      },
      {
        eventId: getId(events, 2),
        url: "https://thedmonline.com/wp-content/uploads/2022/11/upwk61692004-wikimedia-image-kowb2mxa-750x500.jpg",
        preview: true
      },
      {
        eventId: getId(events, 1),
        url: "https://img.hoodline.com/2021/11/levi_s_concert-1.webp?h=400&w=930&fit=crop&crop=faces,center",
        preview: true
      },
      {
        eventId: getId(events, 1),
        url: "https://img.hoodline.com/2021/11/levi_s_concert-1.webp?h=400&w=930&fit=crop&crop=faces,center",
        preview: false
      },
      {
        eventId: getId(events, 1),
        url: "https://img.hoodline.com/2021/11/levi_s_concert-1.webp?h=400&w=930&fit=crop&crop=faces,center",
        preview: false
      },
      {
        eventId: getId(events, 5),
        url: "https://calendarmedia.blob.core.windows.net/assets/d4c8fe39-8a79-487a-a125-1aff14532f34.jpg",
        preview: true
      },
      {
        eventId: getId(events, 6),
        url: "https://patch.com/img/cdn/users/98549/2011/08/raw/485819e4ef37bf0e44fb526011f1ae56.jpg?width=1200",
        preview: true
      },
    ]

    await queryInterface.bulkInsert(options, data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  }
};
