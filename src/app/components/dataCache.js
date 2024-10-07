/**
 * Proivde key of that exists in local storage and return the data
 * 
 * @param {*} name - name of key in local storage
 * @returns - returns object of data
 */
function getCache(name){
    try{
        const datasetDataCache = localStorage.getItem(name);
        console.log("Data already cached");
        return JSON.parse(datasetDataCache);
    }catch(e){
        console.log("Error: " + e);
    }
}


/**
 * Provide key and data to store in local storage
 * 
 * @param {*} name - name of key in local storage
 * @param {*} data - data to store in local storage
 */
function setCache(name, data){
    try{
        localStorage.setItem(name, JSON.stringify({data}));
        console.log("Data cache, key: " + name);
    }catch(e){
        console.log("Error: " + e);
    }
}


/**
 * Check if key exists in local storage
 * 
 * @param {*} name - name of key in local storage
 * @returns - returns true if key exists in local storage, false otherwise
 */
function checkCache(name){
    try{
        const datasetDataCache = localStorage.getItem(name);
        if(datasetDataCache){
            console.log("Data already cached");
            return true
        }else{
            console.log("Data not cached");
            return false
        }
    }catch(e){
        console.log("Error: " + e);
    }
}


/**
 * Delete key from local storage
 * 
 * @param {*} name - name of key in local storage
 */
function deleteCacheByKey(name){
    try{
        localStorage.removeItem(name);
        console.log("Data cache, key: " + name);
    }catch(e){
        console.log("Error: " + e);
    }
}


/**
 * Delete all keys from local storage that end with suffix
 * 
 * @param {*} suffix - suffix of key/s in local storage
 */
function deleteAllCacheBySuffixCsv(suffix){
    try{
        for (let i = 0; i < localStorage.length; i++){
            let lastIndex = localStorage.key(i).lastIndexOf("-");
            let substring = localStorage.key(i).substring(lastIndex + 1);
            if(substring == suffix){
                localStorage.removeItem(localStorage.key(i));
            }
        }
    }catch(e){
        console.log("Error: " + e);
    }
}

/**
 * Provide key and return timestamp of key
 * 
 * @param {*} name - name of key in local storage
 * @returns - returns timestamp of key
 */
function getCacheTimestamp(name){
    try{
        let timestampIndex = localStorage.key(name).indexOf("-");
        let timestamp = localStorage.key(name).substring(0, timestampIndex);

        return timestamp;
    }catch(e){
        console.log("Error: " + e);
    }

}


/**
 * Provide key and compare timestamp of key to current time
 * 
 * @param {*} name - name of key in local storage
 * @param {*} days - number of days to compare timestamp to
 * @returns - returns true if timestamp is older than days, false otherwise
 */
function compareCacheTimestamp(name, days){
    try{
        const expiryTime = days*24*60*60*1000; //ms
        const now = Date.now()
        const cachedData = getCache(name);
        const dataWrite = cachedData.data.dataWrite;

        return now - dataWrite > expiryTime;
    }catch(e){
        console.log("Error: " + e);
    }

}

export {checkCache, getCache, setCache, deleteCacheByKey, deleteAllCacheBySuffixCsv, getCacheTimestamp,compareCacheTimestamp};