import *  as Nano from 'nano';
class DBService {
  nano: Nano.ServerScope;
  constructor() {
    const port = process.env.SRV_DB_PORT as string;
    const host =  process.env.SRV_DB_URL as string;
    const user = process.env.SRV_DB_USER_ID as string;
    const pw = process.env.SRV_DB_USER_PW as string;
    const url = `http://${user}:${pw}@${host}:${port}`;
    this.nano = Nano.default(url);
  }

  async createDb(dbName: string | undefined) : Promise<Nano.DatabaseCreateResponse | string> {
    if (!dbName) {
      dbName = process.env.SRV_DB_DBNAME as string;
    }
    try {
      return await this.nano.db.create(dbName);
    }
    catch {
      return `Database ${dbName} already exists`;
    }
  }

   dbInfo() {
    return this.db.info();
  }

}
export default DBService;
