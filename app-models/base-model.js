/**
 * base model for all app data models
 */
class BaseModel{
    constructor(){
        this.id = null;
    }

    /**
     * base agnostic data initialization for all app models
     * @param {*} data 
     */
    init(data){
        let keys = Object.keys(this);
        let keyLookup = {};
        keys.forEach(key => {
            keyLookup[key] = key;
        });

        keys.forEach(key => {
            if(keyLookup[key] && data[key]){
                this[key] = data[key];
            }
            else if(key === 'id'){
                this.id = data._id;
            }
        });
    }

    /**
     * base serialize props and values for saving to db and returning data
     * @returns 
     */
    serialize(){
        let keys = Object.keys(this);
        let data = {};
        keys.forEach(key => {
            if(typeof this[key] !== 'function' && (this[key] || this[key] === 0)){
                data[key] = this[key];
            }
        });
        return data;
    }
}

module.exports = {BaseModel};