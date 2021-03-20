import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import config from './config';

class RandomNumberGenerator {

    _url = "https://api.random.org/json-rpc/2/invoke";

    async generate() {
        let formatted = [];
        try {
            const rawSequence = await this._fetch();
            rawSequence.forEach(arr => {
                let seq = "";
                arr.forEach(el => {
                    seq += el.toString();
                });
                formatted.push(parseInt(seq));
            });
            console.log(formatted)
            return formatted;
        } catch (err) {
            console.log(`[ERROR]: ${err}`);
        }
        return formatted;
    }

    async _fetch() {
        let params = config;
        const id = this._getUUID();
        params.id = id;
        const req = await fetch(this._url, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: { 'Content-Type': 'application/json' }
        });
        if (req.status === 200) {
            let res = await req.json();
            if (res.id === id) {
                let sequence = res.result.random.data;
                return sequence;
            } else {
                throw Error('Wrong id returned');
            }
        } else {
            throw Error("Error occurred");
        }
    }

    _getUUID() {
        return uuidv4();
    }

}

export default RandomNumberGenerator;