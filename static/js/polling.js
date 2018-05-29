
function Polling(opt) {
    opt = opt || {};
    this.pollFunc = typeof opt.pollFunc === 'function' ? opt.pollFunc : this._pollFunc;

    this.id = null;
    this.isPolling = false;
    this.interval = 5000; // 默认每隔5秒查询一次
}

Polling.prototype = {
    constructor: Polling,
    setInterval: function(interval) {
        if (isNaN(interval) || interval < 1) {
            return;
        }
        this.interval = interval;
    },
    _setTimeout: function () {
        var that = this;

        this.id = setTimeout(function () {
            that.pollFunc();
            that._setTimeout();
        }, this.interval);

        // console.log("polling id is: " + this.id);
    },
    _pollFunc: function() {
        // console.log("pollFunc, isPolling: " + this.isPolling + ", polling id: " + this.id);
    },
    startPolling: function() {
        if (this.isPolling || this.id) {
            // console.log("isPolling: " + this.isPolling + ", polling id: " + this.id + ", will not start a new polling");
            return;
        }
        this._setTimeout();
        // console.log("start polling new answer, polling id is: " + this.id);
    },
    stopPolling: function() {
        // console.log("stop polling: " + this.id);
        this.isPolling = false;
        clearTimeout(this.id);
        this.id = null;
    }
};

module.exports = Polling;
