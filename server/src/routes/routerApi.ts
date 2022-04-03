import express from 'express';
import ChaincodeRouter from './chaincode.router';
import AdminRouter from './admin.router';

function routerApi(app: express.Express, rootApi: string){
  const router = express.Router();
  const chaincodeRouter = new ChaincodeRouter();
  const adminRouter = new AdminRouter();
  app.use(express.json());
  app.use(rootApi, router);
  router.use('/admin', adminRouter.router);
  router.use('/hyp', chaincodeRouter.router);
}

export default routerApi;
