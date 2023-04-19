'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Attendances';

const { Event, User } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let users = await User.findAll();
    let event = await Event.findAll();

    function getId(array, num) {
      return array[num - 1].id;
    }

    const data = [
      {
        eventId: getId(event, 1),
        userId: getId(users, 1),
        status: "attending"
      },
      {
        eventId: getId(event, 1),
        userId: getId(users, 2),
        status: "pending"
      },
      {
        eventId: getId(event, 2),
        userId: getId(users, 1),
        status: "attending"
      },
      {
        eventId: getId(event, 2),
        userId: getId(users, 2),
        status: "attending"
      },
      {
        eventId: getId(event, 2),
        userId: getId(users, 3),
        status: "pending"
      },
      {
        eventId: getId(event, 3),
        userId: getId(users, 1),
        status: "pending"
      },
      {
        eventId: getId(event, 3),
        userId: getId(users, 3),
        status: "attending"
      },
      {
        eventId: getId(event, 5),
        userId: getId(users, 1),
        status: "attending"
      },
      {
        eventId: getId(event, 5),
        userId: getId(users, 2),
        status: "attending"
      },
      {
        eventId: getId(event, 5),
        userId: getId(users, 3),
        status: "attending"
      },
      {
        eventId: getId(event, 5),
        userId: getId(users, 4),
        status: "attending"
      },
      {
        eventId: getId(event, 5),
        userId: getId(users, 5),
        status: "attending"
      },

    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete(options);
  }
};
