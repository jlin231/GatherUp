'use strict';
const {
  Model
} = require('sequelize');

// const { Event, User, eventImage, Image, groupUser, venueGroup, Venue } = require('../models');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //one to many Groups to Events
      Group.hasMany(models.Event, {
        foreignKey: 'groupId'
      })

      //one to many User to Groups, aliased as organizer
      Group.belongsTo(models.User, {
        foreignKey: "organizerId",
        as: "Organizer"
      })

      //many to many group to images
      Group.belongsToMany(models.Image,
        {
          through: models.groupImage,
          foreignKey: "groupId",
          otherKey: "imageId",
          as: "GroupImages"
        })

      //many to many users to groups
      Group.belongsToMany(models.User,
        {
          through: models.groupUser,
          foreignKey: "groupId",
          otherKey: "userId",
          as: "GroupUsers"
        })

      //many to many groups to venues
      Group.belongsToMany(models.Venue,
        {
          through: models.venueGroup,
          foreignKey: "groupId",
          otherKey: "venueId"
        })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numMembers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Group;
};
