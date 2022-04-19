import { } from 'ipfs-core-types';
import { create, IPFSHTTPClient, Options } from 'ipfs-http-client'
import { AddAllOptions, AddOptions, AddResult, CatOptions, IDOptions, IDResult, IPFSEntry, ListOptions, VersionResult } from 'ipfs-core-types/src/root';
import { ImportCandidate, ImportCandidateStream, IPFSPath, ToContent, ToDirectory, ToFile, ToFileMetadata } from 'ipfs-core-types/src/utils';
import { optional } from 'joi';
import { chown } from 'fs';

class IPFSService {
  ipfsNode: IPFSHTTPClient;
  constructor() {
    console.log("Connecting to ipfs node...");
    let opt: Options = {
      host: "127.0.0.1",
      port: 5001,
      protocol: 'http'
    }
    this.ipfsNode = create(opt);
  }

  async version(): Promise<VersionResult> {
    return await this.ipfsNode.version();
  }

  async addFile(path: string, content: ToContent): Promise<AddResult> {
    let file: ToFile | ToDirectory | ToFileMetadata = { path: path, content: content };
    let options: AddOptions = {};
    let addedFile = await this.ipfsNode.add(file, options)
    return addedFile;
  }

  addFiles(stream: ImportCandidateStream, options: AddAllOptions): AsyncIterable<AddResult> {
    let addedFile = this.ipfsNode.addAll(stream, options)
    return addedFile;
  }


  cat(path: IPFSPath, options: CatOptions): AsyncIterable<Uint8Array> {
    return this.ipfsNode.cat(path, options);
  }

  get(path: IPFSPath): AsyncIterable<Uint8Array> {
    return this.ipfsNode.get(path);
  }

  list(path: IPFSPath, options: ListOptions): AsyncIterable<IPFSEntry> {
    return this.ipfsNode.ls(path, options);
  }

  async peerId(options?: IDOptions): Promise<IDResult> {
    return await this.ipfsNode.id(options);
  }


}
export default IPFSService;
