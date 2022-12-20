'use strict';
const { Model, Validator, QueryInterface } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Group, eventAttendee, Event } = require('../models');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    //edit? find where is this is being used
    toSafeObject() {
      const { id, username, email, firstName, lastName } = this; // context will be the User instance
      return { id, firstName, lastName, username, email };
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    }
    //make sure this works
    static async getCurrentUserById(id) {
      return await User.scope("currentUser").findByPk(id);
    }

    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ username, firstName, lastName, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
        firstName,
        lastName
      });
      return await User.scope('currentUser').findByPk(user.id);
    }

    static associate(models) {
      // define association here

      //one to many User to Groups, aliased as organizer
      User.hasMany(models.Group, {
        foreignKey: 'organizerId',
      })

      //many to many event to attendees(user)
      User.belongsToMany(models.Event,
        {
          through: models.eventAttendee,
          foreignKey: "userId",
          otherKey: "eventId"
        })
      
      //many to many users to groups
      User.belongsToMany(models.Group,
        {
          through: models.groupUser,
          foreignKey: "userId",
          otherKey: "groupId"
        })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        },
        len: [4, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [3, 256]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 256]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 256]
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'updatedAt', 'email', 'createdAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: {
          exclude: ['hashedPassword']
        }
      },
      loginUser: {
        attributes: {}
      }
    }
  });
  return User;
};
