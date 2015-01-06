# github-notifications
[![NPM](https://nodei.co/npm/github-notifications.png)](https://nodei.co/npm/github-notifications/)

Readable object stream for notifications of a GitHub user.

## usage

The ghToken is a token for the GitHub user with `notifications` permission. You
can use the `ghauth` module for getting this or create them in [settings/applications](https://github.com/settings/applications).

```js
var ghnotis = require('github-notifications')

ghnotis(ghToken).on('data', function (notification) {
  console.log(notification)
})

```