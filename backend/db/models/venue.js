'use strict';
const {
  Model
} = require('sequelize');

// const { Event, Group, venueGroup } = require('../models');

module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      //one to many Venue to Events 
      Venue.hasMany(models.Event,
        { foreignKey: 'venueId', hooks: true })

      //many to many groups to venues
      Venue.belongsToMany(models.Group,
        {
          through: models.venueGroup,
          foreignKey: "venueId",
          otherKey: "groupId"
        })
    }
  }
  Venue.init({
    address: {
      type: DataTypes.STRING,
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
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Venue;
};
