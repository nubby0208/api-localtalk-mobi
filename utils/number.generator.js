
const { numbersSchemaModel } = require('../models/NumberModels');

const generateNumber = (length) => {
    var result = '';
    var characters = '0123456789';
    var charactersAlpha = 'ACDEFGHJKLMNPQRSTUVWXYZ';
    var charactersLength = characters.length;
    result = charactersAlpha.charAt(Math.floor(Math.random() * 1));
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};

const checkIfExist = async (number) => {
    const isExist = await numbersSchemaModel.findOne({ number });
    return isExist;
};

exports.generateNumbersUtility = async (length) => {
    for (var i = 0; i < length; i++) {
        setTimeout(() => {
            let number = generateNumber(7);
            let checkNumber = checkIfExist(number);
            console.log(checkNumber);
           // if(!checkNumber){
                console.log("Number===>", number);
                let numbersModel = new numbersSchemaModel({
                    number: Number(number),
                    isAssigned: false
                });
                numbersModel.save(async err => {
                    if (err) {
                      console.log("Err=>>>" , err)
                    } else {
                      
                    }
                });
            //} else{
            //console.log("Else Number exist")
           // }

        }, 100);
    }
}

exports.generateTenNumbers = (count) => {
    return new Promise((resolve, reject) => {
        let numberList = [];
        for (let j = 0; j < count; j++) { 
            var charactersAlpha = 'ACDEFGHJKLMNPQRSTUVWXYZ'; 
            var  result = charactersAlpha.charAt(Math.floor(Math.random() * charactersAlpha.length));
            result += Math.floor(100000 + Math.random() * 900000)
            numberList.push(result);
            if (j == count - 1) {
                resolve(numberList);
            }
        }
    });
}