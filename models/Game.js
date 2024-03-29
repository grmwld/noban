/**
 * Game model
 */
module.exports = function(app, conf) {

  var Schema        = app.db.Schema
    , ObjectId      = Schema.ObjectId
    , mongooseAuth  = app.modules.mongooseAuth;


  /**
   * GameSchema
   */
  var GameSchema = new Schema({
      title: String
    , created_at: { type: Date, default: Date.now }
    , size: Number
    , open: { type: Boolean, default: true }
    , finished: { type: Boolean, default: false }
    , creator: { type: ObjectId, ref: 'Player' }
    , turns: {
        black: [String]
      , white: [String]
      }
    , players: {
        black: { type: ObjectId, ref: 'Player' }
      , white: { type: ObjectId, ref: 'Player' }
      , waiting: [{ type: ObjectId, ref: 'Player' }]
      }
    , winner: { type: ObjectId, ref: 'Player' }
    , loser: { type: ObjectId, ref: 'Player' }
    , level: {
        min: {
          kyu: Number
        , dan: Number
        }
      , max: {
          kyu: Number
        , dan: Number
        }
      }
  });
  var Game = null;


  /**
   * Methods
   */
  GameSchema.statics.findByTitle = function(title, callback) {
    return this.find({ title: title }, callback);
  }

  GameSchema.statics.findAvailable = function(callback) {
    return this.find({
      open: true
    , finished: false
    })
      .sort('creationDate', 'descending')
      .execFind(callback);
  }


  /**
   * Define model.
   */
  Game = app.db.model('Game', GameSchema);
  

  /**
   * Return the Game model
   */
  return Game

}
