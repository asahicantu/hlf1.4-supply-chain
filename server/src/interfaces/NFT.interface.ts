
interface Chaincode {

  organization:string,
  userId: string,
  channel: string,
  name: string
  functionName:string
  params: Record<string,string>
}

export default Chaincode;
