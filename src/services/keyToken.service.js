'use strict';

const { filter } = require("lodash");
const keytokenModel = require("../models/keytoken.model");
const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {

    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // const publicKeyString = publicKey.toString();
            // const tokens = new keyTokenModel({
            //     user: userId,
            //     publicKey: publicKeyString,
            //     refreshToken: []
            // });
            // return tokens ? tokens.publicKey : null;
            const filter = {user: userId}
            const update = {publicKey, privateKey, refeshTokenUsed: [], refreshToken}
            const options = {upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            console.log('Key token service', tokens)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            throw error;
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({user: new Types.ObjectId(userId)})
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({
            _id: new Types.ObjectId(id)
        })
    }

    static findByRefreshToken= async (refreshToken) => {
        return await keyTokenModel.findOne({refreshToken: refreshToken})
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshTokenUsed: refreshToken}).lean()
    }

    static deleteKeyByUserId = async (userId) => {
        return await keyTokenModel.deleteMany({user: new Types.ObjectId(userId)})
    }

    static updateRefreshTokenUsed = async (userId, refreshToken) => {
        return await keyTokenModel.findOneAndUpdate({user: new Types.ObjectId(userId)}, {$push: {refreshTokenUsed: refreshToken}, refreshToken: refreshToken})
    }
}

module.exports = KeyTokenService;