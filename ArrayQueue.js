

function ArrayQueue() {
    var arr = [];
    var length = 0 ;
    //入队操作  
    this.push = function (element) {
        length++
        return arr.push(element);
    }
    //出队操作  
    this.pop = function () {
        length--;
        return arr.shift();
    }

    //清空队列  
    this.clear = function () {
        arr = [];
        length = 0;
    }
    //获取队长  
    this.size = function () {
        return length;
    }
}

module.exports = ArrayQueue;