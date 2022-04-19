#!/bin/bash
source scripts/utils.sh
source scripts/envVar.sh
# Parse commandline args
## Parse mode
if [[ $# -lt 1 ]] ; then
  printHelp
  exit 0
else
  MODE=$1
  shift
fi


# parse flags
while [[ $# -ge 1 ]] ; do
    key="$1"
    case $key in
    -h )
        printHelp $MODE
        exit 0
        ;;
    * )
        errorln "Unknown flag: $key"
        printHelp
        exit 1
        ;;
    esac
    shift
done


if [ "$MODE" == "start" ]; then
    ./scripts/start.sh
    ./scripts/ipfs.sh
    chaincodeName="erc721"
    ./scripts/deployCC.sh $CHANNEL_NAME $chaincodeName "../chaincode/token-erc-721/chaincode-javascript" "javascript"
elif [ "$MODE" == "deployCC" ]; then
    infoln "Deploying chaincode"
    chaincodeName="erc721"
    ./scripts/deployCC.sh $CHANNEL_NAME $chaincodeName "../chaincode/token-erc-721/chaincode-javascript" "javascript" "12.0" "10"
    #./network.sh deployCC -ccn erc1155 -ccp ../token-erc-1155/chaincode-go/ -ccl go
    #./scripts/deployCC.sh $CHANNEL_NAME $CC_NAME $CC_SRC_PATH $CC_SRC_LANGUAGE $CC_VERSION $CC_SEQUENCE $CC_INIT_FCN $CC_INVK_FCN $CC_END_POLICY $CC_COLL_CONFIG $CLI_DELAY $MAX_RETRY $VERBOSE
    #./network.sh deployCC -ccn basic -ccp ../chaincode/token-erc-20/chaincode-go -ccl go
elif [ "$MODE" == "stop" ]; then
    ./scripts/stop.sh
elif [ "$MODE" == "restart" ]; then
    ./scripts/stop.sh
    ./scripts/start.sh
else
    printHelp
fi