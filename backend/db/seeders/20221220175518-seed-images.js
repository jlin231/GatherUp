'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Images';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [
      {
        url: "https://upload.wikimedia.org/wikipedia/en/4/47/Taylor_Swift_-_Red_%28Taylor%27s_Version%29.png?20211226114756",
        preview: true 
      },
      {
        url: "https://photoresources.wtatennis.com/photo-resources/2019/08/15/dbb59626-9254-4426-915e-57397b6d6635/tennis-origins-e1444901660593.jpg?width=1200&height=630",
        preview: false
      },
      {
        url: "https://paradepets.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_700/MTkxMzY1Nzg4NjczMzIwNTQ2/cutest-dog-breeds-jpg.webp",
        preview: true 
      },
      {
        url: "http://cdn.akc.org/content/hero/cute_puppies_hero.jpg",
        preview: true 
      },
      {
        url: "https://img.hoodline.com/2021/11/levi_s_concert-1.webp?h=400&w=930&fit=crop&crop=faces,center",
        preview: true 
      },
    ]

    await queryInterface.bulkInsert(options, data);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Images';
    await queryInterface.bulkDelete(options);
  }
};
