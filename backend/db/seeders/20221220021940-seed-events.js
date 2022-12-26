'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Event } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const startDate = new Date('2021-11-19 20:00:00');
    const endDate = new Date('2021-11-21 20:00:00');
    let date = new Date();
    const data = [
      {
        groupId: 1,
        venueId: 1,
        name: "Taylor Swift concert",
        type: "Online",
        capacity: 100,
        price: 12.99,
        description: "A concert for Taylor Swift.",
        startDate,
        endDate
      },
      {
        groupId: 1,
        venueId: 2,
        name: "Taylor Swift event in the park",
        type: "Online",
        capacity: 50,
        price: 30.00,
        description: "A Taylor Swift fan group event.",
        startDate : new Date('2021-12-19 20:00:00'),
        endDate
      },
      {
        groupId: 1,
        venueId: null,
        name: "Amazing Taylor Swift Online concert",
        type: "Online",
        capacity: 50,
        price: 30.00,
        description: "A Taylor Swift fan group event to enjoy music together.",
        startDate,
        endDate
      },
      {

        groupId: 2,
        venueId: 2,
        name: "Dog Park event",
        type: "In Person",
        capacity: 502,
        price: 2.00,
        description: "Dogs play together",
        startDate,
        endDate
      },
      {
        groupId: 3,
        venueId: 3,
        name: "Tennis Event",
        type: "In Person",
        capacity: 502,
        price: 3.00,
        description: "College Tennis players",
        startDate,
        endDate
      }
    ]
    options.tableName = 'Events';
    await queryInterface.bulkInsert(options, data);
  },

  async down(queryInterface, Sequelize) {

    options.tableName = 'Events';
    await queryInterface.bulkDelete(options);
  }
};
