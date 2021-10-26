
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


// Info4You
async function info4you(isbn) {
    let response = await fetch(`https://lspl-info4you.glitch.me/search?isbn=${isbn}`)
    let isbn_data = await response.json()
    // console.log(isbn_data)
    // console.log("isbn",isbn)

    let data_info4you = await fetch(`https://lspl-info4you.glitch.me/info/${isbn_data.ID}`)
    let data = handleResponse_info4you(data_info4you)
    return  data
}

function handleResponse_info4you(response) {
    var json = response.json();
    // console.log("info",json)

    var responseObj = {};
    json.then((result) => {
        // console.log("result info4you", result)
        // Object.keys(result).length != 0
        if ( result != null && result.Author != null) {
            responseObj["Author"] = result.Author
        }
        if (result != null && result.Publisher != null) {
            responseObj["Publisher"] = result.Publisher
        }
        console.log("resobj info4you", responseObj)
        // return responseObj;
    })
    return responseObj;
}

// Bookie
async function bookie(isbn) {
    let data_bookie = await fetch(`https://lspl-bookie.glitch.me/books/${isbn}/details?key=${process.env.glitch_APIKEY}`)
    let data = handleResponse_bookie(data_bookie)
    return data
}

function handleResponse_bookie(response) {
    var json = response.json();
    // console.log("bookie",json)
    var responseObj = {};
    json.then((result) => {
        // console.log("result boookie", result)
        
        if (result != null && result.Author != null) {
            responseObj["Author"] = result.Author
        }
        if (result != null && result.Publisher != null) {
            responseObj["Publisher"] = result.Publisher
        }
        console.log("resobj bookie", responseObj)
        
    })
    return responseObj;

}

// OpenLibrary
async function openLibrary(isbn) {

    let data_openLibrary = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`)
    // console.log("data_openLibrary",data_openLibrary)
    let data = handleResponse_openLibrary(data_openLibrary, isbn)
    return data
}

function handleResponse_openLibrary(response, isbn) {
    var json = response.json();
    var responseObj = {};
    json.then((result) => {

        var ISBN = "ISBN:" + isbn

        let isbn_data = result[ISBN]//["ISBN:9780748798476"]
        // console.log("title",isbn_data.details.title)//.details.title)
        responseObj["Name"] = isbn_data.details.title
    })

    return responseObj;

}

module.exports = {
    bookie,
    info4you,
    openLibrary,
    handleResponse_info4you,
    handleResponse_bookie,
    handleResponse_openLibrary
}