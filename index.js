const axios = require("axios").default
const cheerio = require("cheerio")

const trackSelector = '.bucket-item.ec-item.track'
const trackTitleSelector = '.buk-track-primary-title'
const trackTitleRemixSelector = '.buk-track-remixed'
const trackArtistsSelector = '.buk-track-artists'
const trackRemixersSelector = '.buk-track-remixers'

async function scrapeChartFromURL(url) {
    const response = await makeNetworkRequest(url)
    return parseData(response.data)
}

async function makeNetworkRequest(url) {
    return await axios.get(url)
}

function parseData(data) {
    const $ = cheerio.load(data)

    const tracks = $(trackSelector)
    console.info("Found", tracks.length, "tracks")

    if (tracks.length == 0) {
        console.error("No items found at selector: ", trackSelector)
    }

    const returnObject = []

    tracks.each((_, el) => {
        let infoObject = {}

        const trackTitle = $(el).find(trackTitleSelector).text().trim()

        const trackTitleRemix = $(el).find(trackTitleRemixSelector).text().trim()

        const trackArtists = []

        $(el).find(trackArtistsSelector).find('a').each((_, trackArtist) => {
            trackArtists.push($(trackArtist).text().trim())
        })

        const trackRemixers = []

        $(el).find(trackRemixersSelector).find('a').each((_, trackRemixer) => {
            trackRemixers.push($(trackRemixer).text().trim())
        })

        infoObject['trackTitle'] = trackTitle
        infoObject['trackTitleRemix'] = trackTitleRemix
        infoObject['trackArtists'] = trackArtists
        infoObject['trackRemixers'] = trackRemixers

        returnObject.push(infoObject)
    })
    return returnObject
}

const url = "https://www.beatport.com/chart/best-new-deep-house-february/550399"

scrapeChartFromURL(url).then(parsedData => {
    console.info('parsedData', parsedData)
}).catch(error => console.log('something went wrong in scrapeChartFromURL!', error))
