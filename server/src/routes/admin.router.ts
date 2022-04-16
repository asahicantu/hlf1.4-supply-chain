import express, { NextFunction } from 'express';
import Boom from 'boom';
import AdminService from '../services/admin.service';
import { User } from 'interfaces/register.interface';
//import {ChaincodeExecOption} from 'interfaces/enums.interface';
import DbService from '../services/db.service';
var _ = require('underscore');
import Chaincode from 'interfaces/NFT.interface';
import { NETWORK_SCOPE_ANYFORTX } from 'fabric-network/lib/impl/event/defaulteventhandlerstrategies';
class AdminRouter {
  router: express.Router;
  adminService: AdminService;
  dbService: DbService;
  constructor() {
    this.router = express.Router();
    this.adminService = new AdminService();
    this.dbService = new DbService();
    _.bindAll(this.adminService, Object.getOwnPropertyNames(Object.getPrototypeOf(this.adminService)));

    this.router.get('/', async (req, res) => {
      const info = await this.dbService.dbInfo();
      console.log(info);
      res.json(info);
    });
    /** Registers a an organization and creates its corresponding wallet */
    this.router.post('/register', async (req, res, next) => {
      try {
        const config = req.body;
        const orgId = config.client.organization;
        config._id = orgId;
        await this.dbService.registerOrg(config);
        const walletUrl = config.organizations[orgId].walletUrl as string;
        const certificateAuthority = config.organizations[orgId].certificateAuthorities[0];
        const authorityConfig = config.certificateAuthorities[certificateAuthority];
        const caClient = this.adminService.buildCAClient(authorityConfig)
        const wallet = await this.adminService.buildWallet(undefined, walletUrl);
        await this.adminService.enrollAdmin(caClient, wallet, config.organizations[orgId].mspid);
        res.json(`Organization ${orgId} registered successfully`);
      }
      catch (error) {
        next(error);
      }
    });

    this.router.post('/enroll', async (req, res, next) => {
      const user = req.body as User;
      const orgId = user.organization;
      const config = await this.dbService.GetConfig(orgId);
      if (!user) {
        next(`Could not find user configuration`)
      }
      if (!config) {
        next(`Could not find configuration set with id ${orgId}`)
      }
      else {
        const certificateAuthority = config.organizations[orgId].certificateAuthorities[0];
        const authorityConfig = config.certificateAuthorities[certificateAuthority];
        const walletUrl = config.organizations[orgId].walletUrl as string;
        const caClient = this.adminService.buildCAClient(authorityConfig);
        const mspId = config.organizations[orgId].mspid;
        const wallet = await this.adminService.buildWallet(undefined, walletUrl);
        await this.adminService.registerAndEnrollUser(caClient, wallet, mspId, user.name, user.affilitation);
        res.json(`User ${user.name} registerd with affiliation ${user.affilitation} for organization ${orgId}`);
      }
    });

    this.router.post('/mint', async (req, res, next) => {
      try {
        const chaincode = req.body as Chaincode;
        console.log('Recovering credentials....');
        const orgId = chaincode.organization;
        let config = await this.dbService.GetConfig(orgId);
        const walletUrl = config.organizations[orgId].walletUrl as string;
        const wallet = await this.adminService.buildWallet(undefined, walletUrl);
        console.log('executing contract...');
        const result = await this.adminService.mint(config, wallet, chaincode.userId, chaincode.channel, chaincode.name, chaincode.params.tokenId, chaincode.params.tokenUrl);
        res.send(result);
      }
      catch (error) {
        next(error);
      }
    });

    this.router.get('/chaincode', async (req, res, next) => {
      try {
        const cc = req.body as Chaincode;
        const orgId = cc.organization;
        let config = await this.dbService.GetConfig(orgId);
        const walletUrl = config.organizations[orgId].walletUrl as string;
        const wallet = await this.adminService.buildWallet(undefined, walletUrl);
        const parms = Object.values(cc.params);
        const result = await this.adminService.chaincode('Read', config, wallet, cc.userId, cc.channel, cc.name, cc.functionName, ...parms);
        res.send(result);
      }
      catch (error) {
        next(error);
      }
    });

    this.router.post('/chaincode', async (req, res, next) => {
      try {
        const cc = req.body as Chaincode;
        const orgId = cc.organization;
        let config = await this.dbService.GetConfig(orgId);
        const walletUrl = config.organizations[orgId].walletUrl as string;
        const wallet = await this.adminService.buildWallet(undefined, walletUrl);
        const parms = Object.values(cc.params);
        const result = await this.adminService.chaincode('Write', config, wallet, cc.userId, cc.channel, cc.name, cc.functionName, ...parms);
        res.send(result);
      }
      catch (error) {
        next(error);
      }
    });
  }
}
export default AdminRouter;
