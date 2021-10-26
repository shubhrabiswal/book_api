const Book = require('../model/book')
// const generateApiKey = require('generate-api-key');
const redis = require('redis');
// const client = redis.createClient(6379)
const env = require('dotenv')
const { bookie,
    info4you,
    openLibrary,
    } = require('./api_data')
env.config()

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// client.on("error", (error) => {
//     console.error(error);
//    });


exports.getdetails = async (req, res) => {
    
    let isbn = req.query.isbn;
    let apikey = req.query.apikey
    console.log(process.env.APIKEY,apikey)
    if (apikey !== process.env.APIKEY) {
        return res.status(401).send({})
    }


    Promise.all([
        bookie(isbn),
        info4you(isbn),
        openLibrary(isbn)
    ]).then((responses) => {
        var final = {}
        final["ISBN"] = isbn
        for(let res of responses){    
                if(Object.keys(res) == "Name"){
                    final["Name"] = res.Name
                }  
                else if (Object.keys(res).length>=2){
                
                    for(let r of Object.keys(res)){
                        if(r == "Author"){
                            final["Author"] = res.Author
                        }
                        if(r == "Publisher"){
                            final["Publisher"] = res.Publisher
                        }
                    }
                }
        }
        return res.status(200).json({
            "Success": true,
            "Data": final,
            "Message": "data found"
        })
    }).catch((error) => {
        console.log("error", error);
    })
}


// exports.getdetails = async (req, res) => {
//     let isbn = req.query.isbn;
//     // let apikey = req.query.apikey

//     // if (apikey !== process.env.APIKEY) {
//     //     return res.status(401).send({})
//     // }

//     let response = await fetch(`https://lspl-info4you.glitch.me/search?isbn=${isbn}`)
//     let isbn_data = await response.json()
//     console.log(isbn_data)
//     console.log("isbn",isbn)

//     //const url = Bookie(isbn)
//     Promise.all([
//         // fetch(`https://lspl-info4you.glitch.me/search?isbn=${isbn}`),
//         fetch(`https://lspl-info4you.glitch.me/info/${isbn_data.ID}`),
//         fetch(`https://lspl-bookie.glitch.me/books/${isbn}/details?key=${process.env.glitch_APIKEY}`),
//         fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`)
//     ]).then((responses) => {
//         console.log(responses)
//         return Promise.all(responses.map((response) => {
//             return response.json();
//         }));
//     }).then((data) => {
//         console.log("data", data);
//         return res.status(200).json({
//             "Success": true,
//             "Data": data,
//             "Message": "data found"
//         })
//     }).catch((error) => {
//         console.log("error", error);
//     })
// }

