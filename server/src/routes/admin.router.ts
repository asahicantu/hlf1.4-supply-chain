import express, { NextFunction } from 'express';
import Boom from 'boom';
import AdminService from '../services/admin.service';
var _ = require('underscore');
import CAParams from '../interfaces/caParams.interface';
import validatorHandler from '../middlewares/validator.handler';
import { nextTick } from 'process';
class AdminRouter {
  router: express.Router;
  service: AdminService;

  constructor() {
    this.router = express.Router();
    this.service = new AdminService();
    _.bindAll(this.service, Object.getOwnPropertyNames(Object.getPrototypeOf(this.service)));

    this.router.get('/', async (req, res) => {
      res.send('Hello from Admin Services.')
    });

    this.router.post('/mint', async (request, response, next) => {
      try {
        const userId = request.query.userId as string;
        const affiliation = request.query.affiliation as string;
        const chaincode = request.query.chaincode as string;
        const channel = request.query.channel as string;
        const tokenId = request.query.tokenId as string;
        const tokenUrl = request.query.tokenUrl as string;
        const ccp: Record<string, any> = request.body;
        if (!ccp) {
          throw ("Missing connection profile as json body");
        }
        if (!ccp || !userId || !affiliation || !chaincode || !channel || !tokenId || !tokenUrl) {
          throw (`Error, missing parameters required in URL userId=${userId}&affiliation=${affiliation}&chaincode:${chaincode}&channel:${channel}&tokenId${tokenId}&tokenUrl=${tokenUrl}`);
        }

        var caHostName = this.keyAt(ccp.certificateAuthorities, 0);
        const mspId = this.elementAt(ccp.organizations, 0).mspid;
        const caClient = this.service.buildCAClient(ccp, caHostName)
        const wallet = await this.service.buildWallet(undefined);
        await this.service.enrollAdmin(caClient, wallet, mspId);
        await this.service.registerAndEnrollUser(caClient, wallet, mspId, userId, affiliation)
        console.log('executing contract...');
        const result = await this.service.mint(ccp, wallet, userId, channel, chaincode, tokenId, tokenUrl);
        response.send(result);
      }
      catch (error) {
        next(error);
      }
    });
    this.router.post('/balance', async (request, response, next) => {
      try {
        const userId = request.query.userId as string;
        const affiliation = request.query.affiliation as string;
        const chaincode = request.query.chaincode as string;
        const channel = request.query.channel as string;
        const tokenId = request.query.tokenId as string;
        const tokenUrl = request.query.tokenUrl as string;
        const ccp: Record<string, any> = request.body;
        if (!ccp) {
          throw ("Missing connection profile as json body");
        }
        if (!ccp || !userId || !affiliation || !chaincode || !channel || !tokenId || !tokenUrl) {
          throw (`Error, missing parameters required in URL userId=${userId}&affiliation=${affiliation}&chaincode:${chaincode}&channel:${channel}&tokenId${tokenId}&tokenUrl=${tokenUrl}`);
        }
        var caHostName = this.keyAt(ccp.certificateAuthorities, 0);
        const mspId = this.elementAt(ccp.organizations, 0).mspid;
        const caClient = this.service.buildCAClient(ccp, caHostName)
        const wallet = await this.service.buildWallet(undefined);
        await this.service.enrollAdmin(caClient, wallet, mspId);
        await this.service.registerAndEnrollUser(caClient, wallet, mspId, userId, affiliation)
        console.log('executing contract...');
        const result = await this.service.balance(ccp, wallet, userId, channel, chaincode, tokenId, tokenUrl);
        response.send(result);
      }
      catch (error) {
        next(error);
      }
    });
  }

  keyAt(element: any, idx: number) {
    return Object.keys(element)[idx];
  }
  elementAt(element: any, idx: number): any {
    return element[Object.keys(element)[idx]];
  }
}
export default AdminRouter;
