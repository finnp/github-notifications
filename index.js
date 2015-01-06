var Readable = require('stream').Readable
var util = require('util')
var request = require('request')

var endpoint = 'https://api.github.com/notifications'

module.exports = Notifications

function Notifications(token) {
  Readable.call(this, {objectMode: true})
  if(!(this instanceof Readable)) return new Notifications(token)
  this._interval = 1
  this._paused = false
  this._timeout = null
  this._headers = {
    'User-Agent': 'module github-notifications',
    'Authorization': 'token ' + token
  }
}
util.inherits(Notifications, Readable)

Notifications.prototype._read = function () {
  var self = this
  this._paused = false
  this.requestOnce()
}

Notifications.prototype.destroy = function () {
  clearTimeout(self._timeout)
}

Notifications.prototype.requestOnce = function () {
  var self = this
  request({url: endpoint, headers: self._headers, json: true}, function (req, res, body) {
    if(res.statusCode === 304 || res.statusCode === 200) {
      self._headers['If-Modified-Since'] = res.headers.date
      self._interval = Number(res.headers['x-poll-interval'])
    }
    if(res.statusCode === 200) {
      body.forEach(function (message) {
        if(!self.push(message)) self._paused = true
      })
    }
    if(!self._paused) self._timeout = setTimeout(self.requestOnce.bind(self), self._interval * 1000)
  })
}
