const FlowRecord = require('./flow-record.model');

const get = (req, res, next) => {

  try {

    const model = new FlowRecord(req.params);
    model.get((flowRecord, error) => {

      if (error) throw error;
      if (flowRecord) {
        return res.status(200).send({ flowRecord: flowRecord });
      }
      res.status(404).send({ message: "record_not_found" });
    });

  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}

const load = (req, res, next) => {

  try {

    const model = new FlowRecord({});
    model.load((flowRecords, error) => {
      if (error) throw error;
      if (flowRecords.length) {
        return res.status(200).send({ items: flowRecords });
      }
      res.status(404).send({ message: "no_record_registered" });
    });

  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}

const getHistoric = (req, res, next) => {

  try {

    const model = new FlowRecord({});
    model.getHistoric(req.params.vehicleId, (flowRecords, error) => {
      if (error) throw error;
      if (flowRecords.length) {
        return res.status(200).send({ items: flowRecords });
      }
      res.status(404).send({ message: "no_record_registered" });
    });

  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}

const remove = (req, res, next) => {

  try {

    const model = new FlowRecord(req.params);
    model.remove((done, error) => {
      if (error) throw error;
      if (done) {
        return res.status(202).send({ message: "record_deleted" });
      }
      res.status(304).send({ message: "record_not_deleted" });
    });

  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
}

module.exports = {
  get,
  load,
  getHistoric,
  remove
};