// const add = (a,b) => {
//     return new Promise((resolve,reject) => {
//         setTimeout(() => {
//             resolve(a+b);
//         }, 2000);
//     })
// }

// // add(5,5)
// // .then(sum => {
// //     console.log(sum);

// //     add(sum,5).then( sum2 => {
// //         console.log(sum2);
// //     }).catch(e => {
// //         console.log(e)
// //     })
    
// // }).catch(e => {
// //     console.log(e);
// // })




// add(5,5)
// .then(sum => {
//     console.log(sum);
//     return add(sum,5)
// })
// .then(sum2 => {
//     console.log(sum2);
// }).catch(e => {
//     console.log(e);
// })

// console.log("This line show first!");








// working with mongoose chining
const {UserModel,TaskModel} = require("../src/DB/models");


const id = "5f717634af08eb47e038dc53";

UserModel.findByIdAndUpdate(id,{ age: 10 })
.then(user => {
    console.log(user);
    return UserModel.countDocuments({ age: 20 })
})
.then(result => {
    console.log(result);
})
.catch(err => {
    console.log(err);
})





