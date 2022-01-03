import { verify } from "crypto";
import { currencyCode } from "../data/countryCode"
const request = require("request")
// import request from "request"
import cheerio from "cheerio"

class Converter {
    constructor(private fromData: string, private toData: string, private amountData: number) {
        // 
    }
    public validCode(countryCode: string): boolean {
        if (countryCode.length < 1) return false;
        if (!(currencyCode.includes(countryCode.toLocaleUpperCase()))) return false;
        return true;
    }
    public swapper() {
        if (this.validCode(this.fromData) && this.validCode(this.toData) && this.amountData > 0) {
            if (!(this.fromData == this.toData))
            return new Promise((resolve, reject) => {
                request(`https://www.google.com/search?q=${this.fromData}+to+${this.toData}`, (error: any, response: any, html: any) => {
                    if (!error && response.statusCode == 200) {
                        const $ = cheerio.load(html)
                        const rate = parseFloat($(".iBp4i").text().split(" ")[0])
                        resolve(rate * this.amountData)
                    }
                    reject(`faced an error \n ${error}`)
                })
            })
        }
    }
}


export default Converter