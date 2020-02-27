const sql = require('./database');

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

    get (result) {

        try {

            sql.query(`SELECT flowRecord.id, flowRecord.vehicle_id,
                    arrival.moment arrival_moment, arrival.user_id arrival_user,
                    departure.moment departure_moment, departure.user_id departure_user
                    FROM flow_records flowRecord
                    LEFT JOIN records arrival ON arrival.id = flowRecord.arrival_id
                    LEFT JOIN records departure ON departure.id = flowRecord.departure_id
                    WHERE flowRecord.id = ? AND flowRecord.inactive = 0`,
            [this.id],
            
            (error, results, field) => {
        
                if (error) throw error;
        
                const flowRecord = results[0];

                if (flowRecord)
                    return result(new FlowRecord(flowRecord));

                result(null);
            });
        }

        catch (ex) {
            result(null, ex);
        }
    }

    load (result) {

        try {

            sql.query(`SELECT flowRecord.id, flowRecord.vehicle_id,
                    arrival.moment arrival_moment, arrival.user_id arrival_user,
                    departure.moment departure_moment, departure.user_id departure_user
                    FROM flow_records flowRecord
                    LEFT JOIN records arrival ON arrival.id = flowRecord.arrival_id
                    LEFT JOIN records departure ON departure.id = flowRecord.departure_id
                    WHERE flowRecord.inactive = 0`,
    
            (error, results, field) => {
        
                if (error) throw error;
        
                result(results.map(flowRecord => new FlowRecord(flowRecord)));
            });
        }

        catch (ex) {
            result(null, ex);
        }
    }

    remove (result) {

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
                    result(results.changedRows > 0);
                });
                
            });
        }

        catch (ex) {
            sql.rollback();
            result(null, ex);
        }
    }
};

module.exports = FlowRecord;