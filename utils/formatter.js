const format =(msg)=>{
    return `${new Date().toISOString()} - ${msg}`;
}
module.exports = {format};