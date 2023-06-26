'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Memberships';

const { Group, User } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let groups = await Group.findAll();
    let users = await User.findAll();

    function getId(array, num) {
      return array[num - 1].id;
    }
    const data = [
      //group 1
      {
        groupId: getId(groups, 1),
        userId: getId(users, 1),
        status: "member"
      },
      {
        groupId: getId(groups, 1),
        userId: getId(users, 2),
        status: "co-host"
      },
      {
        groupId: getId(groups, 1),
        userId: getId(users, 3),
        status: "member"
      },
      {
        groupId: getId(groups, 1),
        userId: getId(users, 4),
        status: "member"
      },
      {
        groupId: getId(groups, 1),
        userId: getId(users, 5),
        status: "member"
      },
      {
        groupId: getId(groups, 1),
        userId: getId(users, 6),
        status: "member"
      },
      //group 2
      {
        groupId: getId(groups, 2),
        userId: getId(users, 3),
        status: "member"
      },
      {
        groupId: getId(groups, 2),
        userId: getId(users, 1),
        status: "co-host"
      },
      {
        groupId: getId(groups, 2),
        userId: getId(users, 2),
        status: "member"
      },
      //group 3
      {
        groupId: getId(groups, 3),
        userId: getId(users, 1),
        status: "member"
      },
      {
        groupId: getId(groups, 3),
        userId: getId(users, 2),
        status: "pending"
      },
      {
        groupId: getId(groups, 3),
        userId: getId(users, 3),
        status: "member"
      },
      {
        groupId: getId(groups, 3),
        userId: getId(users, 5),
        status: "pending"
      },
      {
        groupId: getId(groups, 3),
        userId: getId(users, 6),
        status: "member"
      },
      {
        groupId: getId(groups, 4),
        userId: getId(users, 1),
        status: "member"
      },
      {
        groupId: getId(groups, 4),
        userId: getId(users, 4),
        status: "member"
      },
      {
        groupId: getId(groups, 4),
        userId: getId(users, 7),
        status: "member"
      },
      {
        groupId: getId(groups, 4),
        userId: getId(users, 8),
        status: "member"
      },
    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  }
};
