'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'GroupImages';

const { Group } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let groups = await Group.findAll();

    function getId(array, num) {
      return array[num - 1].id;
    }
    const data = [
      {
        groupId: getId(groups, 1),
        url: "https://upload.wikimedia.org/wikipedia/en/4/47/Taylor_Swift_-_Red_%28Taylor%27s_Version%29.png?20211226114756",
        preview: true
      },
      {
        groupId: getId(groups, 2),
        url: "https://photoresources.wtatennis.com/photo-resources/2019/08/15/dbb59626-9254-4426-915e-57397b6d6635/tennis-origins-e1444901660593.jpg?width=1200&height=630",
        preview: false
      },
      {
        groupId: getId(groups, 3),
        url: "https://paradepets.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_700/MTkxMzY1Nzg4NjczMzIwNTQ2/cutest-dog-breeds-jpg.webp",
        preview: true
      },
      {
        groupId: getId(groups, 2),
        url: "http://cdn.akc.org/content/hero/cute_puppies_hero.jpg",
        preview: true
      },
      {
        groupId: getId(groups, 1),
        url: "https://img.hoodline.com/2021/11/levi_s_concert-1.webp?h=400&w=930&fit=crop&crop=faces,center",
        preview: false
      },
      {
        groupId: getId(groups,4),
        url: "https://static01.nyt.com/images/2023/04/11/multimedia/11nba-budget-kqjz/11nba-budget-kqjz-threeByTwoMediumAt2X.jpg",
        preview: true
      }
    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  }
};
