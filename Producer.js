const Queue = require("./ArrayQueue")
const mapLimit = require("./Multi")

// var sigintCount = 0;
// var productArray = [];
// var productArrayLen = 0;
// var productLock = false;
// var PRODUCT_ARRAY_THRESHOLD = 10;
// let flag = true;

var length = 0;
var queue = new Queue()
var pos ;
var list = []

for (let index = 0; index < 5; index++) {
    //初始化10个
    pos = index;
    queue.push(pos)
    length++ ;
    list.push(pos)    
}

// prod()
test()

async function test(){
    
    while(list.length){
        const data = list.shift()
   
        await new Promise(resolve=>{
            setTimeout(() => {
                resolve()
                console.log(11);
            }, 3000);
        })
    }
}


return 

mapLimit(list, 2 ,async item=>{
    return new Promise(resolve=>{
        setTimeout(() => {
            console.log(item);
            //console.log("3秒鐘處理一個，還剩長度:"+list.length);
            resolve()
        }, 3000);
    })
    
    //console.log(list.length);
})

return 

startJob()


//开启一个生产者
async function prod(){
    //一秒钟生产一个
    setInterval(() => {
        pos ++ 
        queue.push(pos)
        list.push(pos)
        
        console.log("4秒鐘生产一个,还剩长度"+list.length);
        //触发一下消费者

    }, 4000);
}

let mapList = (list, limit, asyncHandle) => {
    let re = (arr) => {
        if (arr.length > 0) {
            return asyncHandle(arr.shift())
                .then(res => {
                    if (res && res == "结束当前并发队列") {
                        return "err and finish";
                    } else {
                        if (arr.length !== 0)
                            return re(arr)
                        else
                            return res;
                    }
                })
        }
    };

    let listCopy = [].concat(list);
    let asyncList = [];
    while (limit--) {
        asyncList.push(re(listCopy))
    }
    return Promise.all(asyncList)
}




//启动的控制权交给调用者
//关闭的控制权交给自己
async function startJob(){
  //  while(true){
        if(length){
            await new Promise(resolve=>{
                setTimeout(re=>{
                    console.log(queue.pop());
                    length--;
                    console.log( "消费一个,还剩长度"+length);
                    resolve()
                },2500)
            })
        }
 //   }

    // while (length) {
    //     await new Promise(resolve=>{
    //         setTimeout(re=>{
    //             console.log(queue.pop());
    //             length--;
    //             console.log( "消费一个,还剩长度"+length);
    //             resolve()
    //         },2500)
    //     })
    // }

    console.log("结束");
}


// var producerTimer = setInterval(function () {
//     if (!productLock) {
//         if (!productLock) {
//             productLock = true;

//             if (productArrayLen < PRODUCT_ARRAY_THRESHOLD) {
//                 productArray.push('product');
//                 productArrayLen++;
//                 console.log('product:' + productArrayLen + '   producer.push');
//             } else {
//                 console.log('product:' + productArrayLen + '   producer.idle');
//             }

//             productLock = false;
//         }
//     }
// }, 500);


// var consumerTimer = setInterval(function () {
//     if (!productLock) {
//         if (!productLock) {
//             productLock = true;

//             if (productArrayLen) {
//                 var product = productArray.shift();
//                 productArrayLen--;
//                 console.log('product:' + productArrayLen + '   consumer.pop');
//             } else {
//                 console.log('product:' + productArrayLen + '   consumer.idle');
//             }

//             productLock = false;
//         }
//     }
// }, 1000);

// function readme() {
// 	console.log('==================================================');
// 	console.log('Auther  : shishuo');
// 	console.log('Date    : 2014-07-05');
// 	console.log('Blog    : https://blog.ibaoger.com/');
// 	console.log('Email   : shishuo365@126.com');
// 	console.log('License : GNU GPL v3');
// 	console.log('==================================================');
// }

// readme();

// process.stdin.resume();
// process.on('SIGINT', function () {
// 	sigintCount++;
// 	if (sigintCount > 1) {
// 		process.exit();
// 	} else {
// 		clearInterval(producerTimer);
// 		clearInterval(consumerTimer);
// 		console.log('Press two times Control-C to exit.');
// 	}
// });

// process.on('exit', function () {
// 	console.log('Thank you for use. Bye bye~');
// });