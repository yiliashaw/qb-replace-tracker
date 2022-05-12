const { URL } = require('node:url')
const semver = require('semver')
const api = require('qbittorrent-api-v2')
const { Confirm } = require('enquirer');

const [
  ,
  ,
  webUI = 'http://admin:admin@localhost:8080/',
  find,
  replace,
] = process.argv;

const parseTracker = (magnet) => {
  const url = new URL(magnet)

  return url.searchParams.get('tr')
}

const main = async () => {
  if (!webUI || !find || !replace) {
    console.log(`Usage:
    node main.js http://admin:admin@localhost:8080/ http://ORIGIN/announce http://REPLACE/announce`)

    process.exit(1)
  }

  const url = new URL(webUI)

  console.log('Connecting...')

  const qbt = await api.connect(url.origin, url.username, url.password);

  const ver = await qbt.apiVersion()

  console.log(`Connection established with api version: ${ver}`)

  if (!semver.satisfies(ver, '>= 2.2.0')) {
    console.log('Require api version >= 2.2.0')
    process.exit(1)
  }

  
  console.log('Getting torrents...')

  const torrents = await qbt.torrents();

  const found = torrents.filter(a => parseTracker(a.magnet_uri) === find)

  if (found.length === 0) {
    console.log(`Found ${found.length} torrents with tracker: ${find}`)
    process.exit(2)
  }

  console.log(`Found ${found.length} torrents with tracker: ${find}`)

  const prompt = new Confirm({
    name: 'confirm',
    message: `Replace these torrent with tracker: ${replace}?`
  })
  
  const answer = await prompt.run()

  if (!answer) {
    console.log('Canceling...')
    process.exit(3)
  }

  for (let i=0; i<found.length; ++i) {
    const item = found[i]
    console.log(`Replacing... ${i + 1}/${found.length}`)

    await qbt.editTrackers(item.hash, find, replace)

    console.log(`Replacing... ${i + 1}/${found.length}: done`)
  }
};

main().then(() => {
  console.log('done')
}, err => {
  console.error('Error')
  console.error(err.stack)
})