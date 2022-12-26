'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Venues';

const { Group} = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let groups = await Group.findAll();

    function getId(array, num) {
      return array[num - 1].id;
    };

    const data = [
      {
        groupId: getId(groups, 1),
        address: "1001 Stadium Dr",
        city: "Inglewood",
        state: "CA",
        lat: 33.9535,
        lng: 18.3390
      },
      {
        groupId: getId(groups, 2),
        address: "124-02 Roosevelt Ave",
        city: "Flushing",
        state: "NY",
        lat: 40.7499,
        lng: 73.8470
      },
      {
        groupId: getId(groups, 3),
        address: "20357 Studebaker Rd",
        city: "Lakewood",
        state: "CA",
        lat: 33.5119,
        lng: 118.6027
      }
    ]

    options.tableName = 'Venues';
    await queryInterface.bulkInsert(options, data);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    await queryInterface.bulkDelete(options);
  }
};
