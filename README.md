# qb-replace-tracker

Bulk replace torrents tracker with qbittorrent web api.
## Requirement

* Node.js `>= 18.0.0`
* qBittorrent `>= 4.1.6`

## Usage

```bash
npx qb-replace-tracker WEBUI_URL OLD_TRACKER NEW_TRACKER
```

Example:

```bash
npx qb-replace-tracker http://admin:admin@127.0.0.1:80 'https://tracker.OLD_DOMAIN.com/announce?passkey=OLD_PASS_KEY' 'https://tracker.NEW_DOMAIN.com/announce?passkey=NEW_PASS_KEY'
```
