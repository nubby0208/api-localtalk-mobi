const MongoClient = require('mongodb').MongoClient;
const urlMongo = process.env.MONGO_URI;//"mongodb+srv://Leo:admin2158600@cluster0.93qwz.mongodb.net/admin_panel?retryWrites=true&w=majority";
const database = process.env.DATABASE;

exports.findMany = (collectionName, data, callback) => {
    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).find(data.query).limit(data.limit)
            .skip(data.startIndex).toArray(function (err, result) {
                if (err) return -1;

                db.close();
                callback && callback(result);
            });
    });

}

exports.findOne = (collectionName, data, callback) => {
    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).findOne(data, function (err, result) {
            if (err) return -1;

            db.close();
            callback && callback(result);
        });
    });

}

exports.findAll = (collectionName, data, callback) => {

    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).find(data, function (err, result) {
            if (err) return -1;

            db.close();
            callback && callback(result);
        });
    });

}

exports.findOneAndUpdate = (collectionName, filterData, data, callback) => {

    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).findOneAndUpdate(filterData, { $set: data }, function (err, result) {
            if (err) return -1;

            db.close();
            callback && callback(result);
        });
    });

}

exports.save = (collectionName, data, callback) => {

    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).insertOne(data, function (err, result) {
            if (err) throw err;

            db.close();
            callback && callback(result);
        });
    });

}


exports.saveMany = (collectionName, data, callback) => {

    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).insertMany(data, function (err, result) {
            if (err) throw err;

            db.close();
            callback && callback(result);
        });
    });

}

exports.updateOne = (collectionName, filterData, data, callback) => {

    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).updateOne(filterData, { $set: data }, function (err, result) {
            if (err) throw err;

            db.close();
            callback && callback(result);
        });
    });

}

exports.updateMany = (collectionName, data, callback) => {

    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).updateMany(filterData, { $set: data }, function (err, result) {
            if (err) throw err;

            db.close();
            callback && callback(result);
        });
    });

}

exports.deleteOne = (collectionName, data, callback) => {

    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).deleteOne(data, function (err, result) {
            if (err) throw err;

            db.close();
            callback && callback(result);
        });
    });

}

exports.deleteMany = (collectionName, data, callback) => {

    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(collectionName).deleteMany(data, function (err, result) {
            if (err) throw err;

            db.close();
            callback && callback(result);
        });
    });

}

//findByIdAndDelete
//findOneAndRemove