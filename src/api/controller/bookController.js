const Book = require('../model/book')
const generateApiKey = require('generate-api-key');
const redis = require('redis');
// const client = redis.createClient(6379)
const env = require('dotenv')
env.config()

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// client.on("error", (error) => {
//     console.error(error);
//    });

exports.addapikey = async (req, res) => {
    let isbn = req.query.isbn;
    try {
        let apikey = generateApiKey({
            method: 'string',
            min: 10,
            max: 20,
            pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        });

        let newdata = await new Book({
            isbn: isbn,
            apikey: apikey
        });

        await newdata.save()

        return res.status(200).json({
            "Success": true,
            "Data": newdata,
            "Message": `apikey created for isbn ${isbn}`
        })
    }
    catch (error) {
        return res.status(200).json({
            "Success": false,
            "Data": null,
            "Message": error.message
        })
    }
}


exports.getdetails = async (req, res) => {
    let isbn = req.query.isbn;
    let apikey = req.query.apikey

    if (apikey !== process.env.APIKEY) {
        return res.status(401).send({})
    }

    let response = await fetch(`https://lspl-info4you.glitch.me/search?isbn=${isbn}`)
    let isbn_data = await response.json()
    console.log(isbn_data)
    console.log("isbn",isbn)
    Promise.all([
        // fetch(`https://lspl-info4you.glitch.me/search?isbn=${isbn}`),
        fetch(`https://lspl-info4you.glitch.me/info/${isbn_data.ID}`),
        fetch(`https://lspl-bookie.glitch.me/books/${isbn}/details?key=${process.env.glitch_APIKEY}`),
        fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`)
    ]).then((responses) => {
        // console.log(responses)
        return Promise.all(responses.map((response) => {
            return response.json();
        }));
    }).then((data) => {
        console.log("data", data);
        return res.status(200).json({
            "Success": true,
            "Data": data,
            "Message": "data found"
        })
    }).catch((error) => {
        console.log("error", error);
    })
}

// exports.getdetails = async (req, res) => {
//     let isbn = req.query.isbn;
//     let apikey = req.query.apikey
//     try {
//         let apidata = await Book.findOne({ apikey: apikey,isbn:isbn })

//         if (apidata == null || apidata.length == 0) {
//             return res.status(401).send({})
//         }

//         client.get(isbn,  async (err, data) => {

//             if (err) {
//                 console.log(err)
//                 throw err;
//             }

//             if (data !== null) { 
//                 return res.status(200).json({
//                     "Success": true,
//                     "Data": data,
//                     "Message": "data found from cache"
//                 })
//             } else {

//                 let response = await fetch(`https://lspl-info4you.glitch.me/search?isbn=${isbn}`)
//                 let isbn_data = await response.json()  //JSON.stringify(response) 

//                 let idresponse =  await fetch(`https://lspl-info4you.glitch.me/info/${isbn_data.ID}`)
//                 let id_data =  await idresponse.json()  //JSON.stringify(idresponse) 

//                 client.setex(isbn, 360, JSON.stringify(id_data));

//                 return res.status(200).json({
//                     "Success": true,
//                     "Data": id_data,
//                     "Message": "data found from server"
//                 }) 
//             }
//         })

//     }
//     catch (error) {
//         return res.status(200).json({
//             "Success": false,
//             "Data": null,
//             "Message": error.message
//         })
//     }
// }




// exports.getdetails = async (req, res) => {
//     let isbn = req.query.isbn;
//     let apikey = req.query.apikey
//     try {

//         let apidata = await Book.findOne({ apikey: apikey })

//         if (apidata == null || apidata.length == 0) {
//             return res.status(401).send({})
//         }

//         let response = await fetch(`https://lspl-info4you.glitch.me/search?isbn=${isbn}`)
//         let isbn_data = await response.json()

//         let idresponse = await fetch(`https://lspl-info4you.glitch.me/info/${isbn_data.ID}`)
//         let id_data = await idresponse.json()
//         return res.status(200).json({
//             "Success": true,
//             "Data": id_data,
//             "Message": "data found"
//         })
//     }
//     catch (error) {
//         return res.status(200).json({
//             "Success": false,
//             "Data": null,
//             "Message": error.message
//         })
//     }
// }
