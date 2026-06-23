

import crypto from "crypto";

export const getResetToken = (token) => {
    /**
     * createHash() :  produce 256 bit/64 char hash using sha256 algorithm
     * update(token) : feed token to object tokenHash to process
     * digest() : calculate the final hex and return it as a hexaedecimal string
     */
    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    return tokenHash;
}

