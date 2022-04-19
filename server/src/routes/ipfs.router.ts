import express, { NextFunction, response } from 'express';
import Boom from 'boom';
var _ = require('underscore');
import AdminService from 'services/admin.service';
import DbService from '../services/db.service';
import IPFSService from '../services/ipfs.service';
import { ImportCandidateStream, IPFSPath, ToContent } from 'ipfs-core-types/src/utils';
import { AddAllOptions, CatOptions, IDOptions, ListOptions } from 'ipfs-core-types/src/root';

class IPFSRouter {
  router: express.Router;
  ipfsService: IPFSService;
  dbService: DbService;
  adminService: AdminService;
  constructor() {
    this.router = express.Router();
    this.ipfsService = new IPFSService();
    _.bindAll(this.ipfsService, Object.getOwnPropertyNames(Object.getPrototypeOf(this.ipfsService)));

    this.router.get('/', async (req, res) => {
      const parameters = await this.ipfsService.version();
      res.json(parameters);
    });

    this.router.post('/add/file',
      async (request, response, next) => {
        let path: string = request.query.path as string;
        let content: ToContent = request.body as string;
        console.log(content);
        let result = await this.ipfsService.addFile(path, content);
        console.log(result);
        response.json(result.cid.toString());
      });

    this.router.post('/add/files',
      async (request, response, next) => {
        let stream: ImportCandidateStream = request.body.stream;
        let options: AddAllOptions = request.body.options;
        let content: ToContent = request.body.content;
        let result = this.ipfsService.addFiles(stream, options);
        response.json(result);
      });

    this.router.get('cat', async (req, res) => {
      let path: IPFSPath = req.body.path;
      let options: CatOptions = req.body.options;
      let content = this.ipfsService.cat(path, options);
      response.json(content);
    });


    this.router.get('get', async (req, res) => {
      let path: IPFSPath = req.body.path;
      let options: CatOptions = req.body.options;
      let content = this.ipfsService.get(path);
      response.json(content);
    });


    this.router.get('list', async (req, res) => {
      let path: IPFSPath = req.body.path;
      let options: ListOptions = req.body.options;
      let content = this.ipfsService.list(path, options);
      response.json(content);
    });

    this.router.get('peer', async (req, res) => {
      let options: IDOptions = req.body.options;
      let content = this.ipfsService.peerId(options);
      response.json(content);
    });
  }
}
export default IPFSRouter;
