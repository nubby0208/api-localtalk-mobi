const { numbersSchemaModel } = require('../models/NumberModels');
const { generateNumbersUtility ,generateTenNumbers} = require('../utils/number.generator');
const MongoClient = require('mongodb').MongoClient;
const urlMongo = "mongodb+srv://Leo:admin2158600@cluster0.93qwz.mongodb.net/admin_panel?retryWrites=true&w=majority";

const checkIfExist = async (numberId) => {
    const number = await userSchemaModel.findOne({ numberId });
    return number || null;
};

exports.numbersList = async (req, res) => {
    const { limit, startIndex } = req.body;
    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db("admin_panel");
        dbo.collection("numbers").find({isAssigned: false}).limit(limit)
        .skip(startIndex).toArray(function (err, result) {
            if (result.length === 0) {
                res.status(500).send({ error: true, data: [] });
            } else {
                res.send({ error: false, data: result });
            } 
            db.close();
        });
    });
  
    // const numbers = await numbersSchemaModel
    //     .find({ isAssigned: false })
    //     .limit(limit)
    //     .skip(startIndex);

    // if (numbers.length === 0) {
    //     res.status(500).send({ error: true, data: [] });
    // } else {
    //     res.send({ error: false, data: numbers });
    // }
}

exports.numbersListV2 = async (req, res) => {
    try{
        generateTenNumbers(20).then((result) => {
        
            let numberList = [];
            for (let i = 0; i < result.length; i++) {
              
                if (numberList.length != 10) {
                    let number = result[i];
                    numberList.push({ number: result[i], isAssigned: false, created: 1646159576 });
                     mongoService.findOne("numbers", { number }, async (resultf1) => {
                        console.log("Here");
                        
                         if (!resultf1) {
                         
                            // mongoService.save("numbers", { number: result[i], isAssigned: false, created: 1646159576 }, async (resultf2) => {
                                 numberList.push({ number: result[i], isAssigned: false, created: 1646159576 });
                             //});
                         }
                     });
                } else if (numberList.length == 10) {
                    res.send({ error: false, data: numberList });
                    break;
                } 
                // else {
                //     if (i == result.length - 1) {
                //         if (numberList.length < 10) {
                //             var remaining = numberList.length - 10;
                //             for (let k = 0; k < remaining.length; i++) {
                //                 generateTenNumbers(20).then((result2) => {
                //                     numberList.push({ number: result2[k], isAssigned: false, created: 1646159576 })
                //                 }); 
                //                 if(k == remaining.length -1){
                //                     res.send({ error: false, data: numberList });
                //                     break;
                //                 }
                //             }
                //         }
                //     }
                // }
            }
        });
    } catch (err){
        console.log(err);
    }
   
}

exports.availablityCheck = async (req, res) => {
   const { number } = req.body;

    MongoClient.connect(urlMongo, function (err, db) {
        if (err) throw err;
        var dbo = db.db("admin_panel");
        dbo.collection("numbers").findOne({ number, isAssigned: true }, function (err, result) {
            if (err) throw err;
            if (!!result) {
                res.status(500).send({ error: true, data: "number_not_available" });
            } else {
                res.send({ error: false, data: "number_available" });
            }
            db.close();
        });
    });

    // const numbers = await numbersSchemaModel
    //     .findOne({ number, isAssigned: true });

    // if (!!numbers) {
    //     res.status(500).send({ error: true, data: "number_not_available" });
    // } else {
    //     res.send({ error: false, data: "number_available" });
    // }
}

exports.generateNumbers = async (req, res) => {
    console.log(req.body)
    const { length } = req.body;
    const numbers = generateNumbersUtility(length);
    if (numbers.length === 0) {
        res.status(500).send({ error: true, data: [] });
    } else {
        res.send({ error: false, data: numbers });
    }
}