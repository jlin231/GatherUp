'use strict';
const {
  Model
} = require('sequelize');

const {eventImage, Event, Group, groupImage } = require('../models');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //many to many event to images
      Image.belongsToMany(models.Event,
        {
          through: models.eventImage,
          foreignKey: "imageId",
          otherKey: "eventId"
        })
    
      //many to many group to images
      Image.belongsToMany(models.Group,
        {
          through: models.groupImage,
          foreignKey: "imageId",
          otherKey: "groupId"
        })
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
