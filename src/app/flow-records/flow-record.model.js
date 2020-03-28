const sql = require('../../db/database');


class FlowRecord {

  constructor (flowRecord) {

    try {

      this.id = flowRecord.id,
        this.vehicle_id = flowRecord.vehicle_id,
        this.arrival = {
          moment: flowRecord.arrival_moment,
          user_id: flowRecord.arrival_user
        }

      if (flowRecord.departure_moment)
        this.departure = {
          moment: flowRecord.departure_moment,
          user_id: flowRecord.departure_user
        }

      else
        this.departure = null;

      this.inactive = flowRecord.inactive;
    }

    catch (ex) {
      return null;
    }
  }

  get (callback) {

    try {

      sql.query(`SELECT * FROM flow_records
                  WHERE id = ? AND inactive = 0`,
      [this.id],

      (error, results, field) => {

        if (error) throw error;
        const flowRecord = results[0];

        if (flowRecord) {
          return callback(new FlowRecord(flowRecord));
        }

        callback(null);
      });

    } catch (ex) {
      callback(null, ex);
    }
  }

  getHistoric (vehicleId, callback) {

    try {

      sql.query(`SELECT * FROM flow_records
                  WHERE vehicle_id = ? AND inactive = 0`,
      [vehicleId],
      (error, results, field) => {

        if (error) throw error;
        const flowRecord = results[0];

        if (flowRecord) {
          return callback(results.map(flowRecord => new FlowRecord(flowRecord)));
        }

        callback(null);
      });

    } catch (ex) {
      callback(null, ex);
    }

  }

  load (callback) {

    try {

      sql.query(`SELECT * FROM flow_records
                  WHERE inactive = 0`,

      (error, results, field) => {

        if (error) throw error;
        callback(results.map(flowRecord => new FlowRecord(flowRecord)));
      });

    } catch (ex) {
      callback(null, ex);
    }
  }

  remove (callback) {

    try {

      sql.beginTransaction((error) => {

        if (error) throw error;

        sql.query(`UPDATE flow_records
                    SET inactive = 1
                    WHERE id = ?`,
        [this.id],
        (error, results, field) => {

          if (error) throw error;

          sql.commit();
          callback(results.changedRows > 0);
        });

      });

    } catch (ex) {
      sql.rollback();
      callback(null, ex);
    }
  }
};

module.exports = FlowRecord;