'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Groups';

const {Group} = require('../models')
const {Op} = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [
      {
        organizerId: 1,
        name: "Taylor Swift Fans",
        about: "A group for Taylor Swift fans to enjoy her music and her events.",
        type: "Online",
        private: false,
        city: "Plano",
        state: "TX"
      },
      {
        organizerId: 2,
        name: "Dog Fans",
        about: "A group for Dog fans to enjoy dogs.",
        type: "In Person",
        private: true,
        city: "Los Angeles",
        state: "CA"
      },
      {
        organizerId: 3,
        name: "Tennis Fans",
        about: "A group for Tennis fans to enjoy tennis and play together.",
        type: "In Person",
        private: false,
        city: "New York City",
        state: "New York"
      }
    ]


    await queryInterface.bulkInsert(options, data);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups';
    await queryInterface.bulkDelete(options);
  }
};
