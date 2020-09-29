const doWork = async () => {
    return "Hii promise";
}

doWork()
.then(result => {
    console.log(result)
})
.catch(e => {
    console.log(e);
})