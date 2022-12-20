'use strict';
const {
  Model
} = require('sequelize');

const {Venue, Group, User,eventAttendee, Image,eventImage} = require('../models');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      //one to many Groups to Events
      Event.belongsTo(models.Group,{
        foreignKey: 'groupId'
      });

      //one to many Venue to Events 
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      });

      //many to many event to attendees(user)
      Event.belongsToMany(models.User,
        {
          through: models.eventAttendee,
          foreignKey: "eventId",
          otherKey: "userId"
        })

      //many to many event to images
      Event.belongsToMany(models.Image,
        {
          through: models.eventImage,
          foreignKey: "eventId",
          otherKey: "imageId"
        })
    
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    //be at least 5 characters
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5,999]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        check(value){
          if(value !== "Online" && value !== "In person"){
            throw new Error("Type must be 'Online' or 'In person'");
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    //throws error if price is invalid has to be in normal form
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    //required
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [50, 999]
      }
    },
    //must be in the future
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    //less than the start date
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    numAttending: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    previewImg: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
