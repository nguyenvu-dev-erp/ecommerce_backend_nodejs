'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const {createTokenPair, verifyJWT} = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenbError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
} 

class AccessService {
    /*
     check token used
    */
    static handlerRefreshToken = async ({refreshToken, user,  keyStore}) => {
        const {userId, email} = user

        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenbError('Please relogin')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')

        const foundShop = await findByEmail({email})
        if (!foundShop) {
            throw new AuthFailureError('Shop not registered') 
        }
        //create new tokens
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)
        //update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })
        return {
            user,
            tokens
        }
    }

    static logout = async (keyStore) => {
        return delKey = await KeyTokenService.removeKeyById(keyStore._id)
    }

    /*
     1: check email is dbs
     2: match password
     3: create AT vs RT and save
     4: generate tokens
     5: get data return login
    */
    static login = async({email, password, refreshToken = null}) => {
        //1.
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new BadRequestError('Shop not registered')
        //2.
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication Error')
        //3.
        //Create privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        //4.
        const {_id: userId} = foundShop
        const tokens = await createTokenPair({
            userId: userId,
            email: email
        }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey
        })
        return {
            metadata: {
                shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
                tokens
            }
        }
    }

    static signUp = async ({name, email, password}) => {
        try {
            const holedShop = await shopModel.findOne({email}).lean();
            if (holedShop) {
                throw new BadRequestError('Error: Shop already registered!')
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({name, email, password: passwordHash, roles: [RoleShop.SHOP]});
            if (newShop) {
                // // tao priveKey, publicKey bang thuat toan bat doi xung
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                // });
                //Create privateKey, publicKey
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                console.log({privateKey, publicKey}); //save collection KeyStore
                
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                });
                if (!keyStore) {
                    return {
                        'code': '20003',
                        'message': 'Create key token failed',
                        'status': 'error'
                    }
                }
                // const publicKeyObject = crypto.createPublicKey(publicKeyString);
                // created token pair
                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email: newShop.email,
                    roles: newShop.roles
                }, publicKey, privateKey);
                console.log('Created tokens Success:', tokens);
                
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            
            return {
                code: 200,
                metadata: null
            }
        }
        catch (error) {
            return {
                'code': '50001',
                'message': error.message,
                'status': 'error'
            }
        }
    }
}

module.exports = AccessService;