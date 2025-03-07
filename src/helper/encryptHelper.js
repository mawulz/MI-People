import CryptoJS from "crypto-js";

const secretKey = `${import.meta.env.VITE_REACT_APP_KEY}`

export const encrypting = (id) =>{
    return new Promise((resolve, reject) => {
        try {
            const encryptingId = encodeURIComponent(CryptoJS.AES.encrypt(id.toString(), secretKey).toString())
            resolve(encryptingId)
        } catch (error) {
            reject(error)
        }
    })
}

export const DecryptID = (encryptedId) =>{
    const decrypted = CryptoJS.AES.decrypt(encryptedId,secretKey)
    return decrypted.toString(CryptoJS.enc.Utf8)    
}
