const crypto = require('crypto');

module.exports = (client,server) => {
    const hash = crypto.createHmac('sha512', server).update(client).digest('hex');
    let index = 0;
        let lucky = parseInt(hash.substring(index*5,index*5+5),16);

        while(lucky >= Math.pow(10,6)) {
            index += 1;
            lucky = parseInt(hash.substring(index*5,index*5+5),16);
            
            if (index*5+5 >129) {
                lucky = 9999;
                break;
            }
        }
        return {hash, number: (lucky%10000)/100};
}
