import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import config from './config';

class RandomNumberGenerator {

    _url = "https://api.random.org/json-rpc/2/invoke";
    _requestType = {
        GENERATE_SEQUENCE: "generateIntegerSequences",
        GENERATE_INTEGERS: "generateIntegers"
    };

    async generateSequence(max, count, length) {
        let sequence = [];
        try {
            sequence = await this._makeRequest(this._requestType.GENERATE_SEQUENCE, max, count, length);
        } catch (err) {
            console.log(`[ERROR]: `, err);
        }
        return sequence;
    }

    async generate(max, count) {
        let random = [];
        try {
            random = await this._makeRequest(this._requestType.GENERATE_INTEGERS, max, count);
            return random;
        } catch (err) {
            console.log(`[ERROR]: `, err);
        }
        return random
    }

    async _makeRequest(method, max, count, length = 0) {
        let reqBody = config;
        const id = this._getUUID();
        reqBody.id = id;
        reqBody.method = method;
        reqBody.params.n = count;
        reqBody.params.min = 1;
        reqBody.params.max = max;
        if (method === this._requestType.GENERATE_INTEGERS) {
            reqBody.params.replacement = false;
            delete reqBody.params.length;
        }
        if (method === this._requestType.GENERATE_SEQUENCE) reqBody.params.length = length;
        return await this._fetch(reqBody, id);

    }

    async _fetch(config, id) {
        const req = await fetch(this._url, {
            method: 'POST',
            body: JSON.stringify(config),
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