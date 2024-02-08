import sessionModel from "../model/session.model.js";

export default class Sessions {
    
    get = (params) => {
        return sessionModel.find(params);
    }

    getBy = (params) => {
        return sessionModel.findOne(params);
    }

    save = (doc) => {
        return sessionModel.create(doc);
    }

    update = (id, doc) => {
        return sessionModel.findByIdAndUpdate(id, { $set: doc });
    }

    delete = (id) => {
        return sessionModel.findByIdAndDelete(id);
    }
}
