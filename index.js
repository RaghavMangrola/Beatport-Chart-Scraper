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
    return axios.get(url)
        .then(response => {
            return response
        }).catch(error => {
            console.error('error', error)
        })
}

function parseData(data) {
    const $ = cheerio.load(data);

    const tracks = $(trackSelector)
    console.info("Found", tracks.length, "tracks")

    if (tracks.length == 0) {
        console.error("No items found at selector: ", trackSelector)
    }

    let returnObject = []

    tracks.each(async (_, el) => {
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
})


