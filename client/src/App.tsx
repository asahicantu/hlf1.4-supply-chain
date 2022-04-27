import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import './App.css';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

export default function App() {
    const ariaLabel = { 'aria-label': 'File name' };
    const [files, setFiles] = useState(new Array<any>());
    const [file, setFile] = useState<any>({name:""});
    const [organization, setOrganization] = useState<string>();
    const [owner, setOwner] = useState<string>();
    const [fileFormat, setFileFormat] = useState<string>("txt");

    const removeFile = (f: any) => {
        const filteredFiles = files.filter(x => x !== f);
        setFiles(filteredFiles);
    }

    const onFileChange = (e: any) => {
        var newFiles = e.target.files;
        var filesArr = Array.prototype.slice.call(newFiles);
        if (filesArr.length > 0) {
            setFile(filesArr[0])
        }
        //setFiles([...files, ...filesArr])
    }

    const handleSubmission = () => {
        const nftContent: any =
        {
            organization: organization,
            userId: owner,
            channel: "mychannel",
            name: "erc721",
            params:
            {
                FileFormat: fileFormat,
                Owner: owner,
                Organization: organization,
                FileName: file.name
            }
        };
        const fl = file as File;
        var reader = new FileReader();
        reader.onload = function(e:any) {
            nftContent.data = new Int8Array(e.target.result);
        };
        reader.onerror = function(e) {
            // error occurred
            console.log('Error : ' + e.type);
        };
        reader.readAsArrayBuffer(fl);
        console.log(nftContent)
        axios.post("http://localhost:3556/api/v1/nft/mint", nftContent)
            .then((response) => {
                console.log(response);
            }
            ).catch((reason: any) => {
                console.log(reason);
            });
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        NFT  Digital Asset Minting
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                </Toolbar>
            </AppBar>
            <form>
                <Grid
                    container
                    wrap="nowrap"
                    spacing={1}
                    direction="column"
                    alignItems="center"
                >
                    <Grid item xs={3} spacing={1}>
                        <Stack direction="column" spacing={3}>
                            <TextField
                                key="txtOrganization"
                                id="txtOrganization"
                                label="Organization"
                                defaultValue="Org1"
                                helperText="Organization name"
                                variant="standard"
                                required={true}
                                onInput={(e:any) => setOrganization(e.target.value)}
                            />
                            <TextField
                                id="txtOwner"
                                label="Owner"
                                defaultValue="minter"
                                helperText="Name of the owner (previously registered in the ledger)"
                                variant="standard"
                                required={true}
                                onInput={(e:any) => setOwner(e.target.value)}
                            />
                            <FormControl fullWidth required={true}>
                                <InputLabel id="lblFileFormat">File Format</InputLabel>
                                <Select
                                    labelId="lblFileFormat"
                                    id="txtFileFormat"
                                    value={fileFormat}
                                    label="File Type"
                                    onChange={(e:any) => setFileFormat(e.target.value)}
                                >
                                    <MenuItem key="FormatTxt" value={"txt"}>Text</MenuItem>
                                    <MenuItem key="FormatImage" value={"image"}>Image</MenuItem>
                                    <MenuItem key="FormatFolder" value={"folder"}>Folder</MenuItem>
                                    <MenuItem key="FormatBin" value={"bin"}>Other binary</MenuItem>
                                </Select>
                            </FormControl>
                            <Stack direction="row" alignItems="baseline">
                                <Input inputProps={ariaLabel} value={file.name} placeholder="Click to select a file" readOnly={true} />
                                <label className="custom-file-upload">
                                    <input type="file" multiple onChange={onFileChange} />
                                    ...
                                </label>
                            </Stack>
                            <Button variant="contained"  onClick={handleSubmission}>Submit</Button>
                        </Stack>
                    </Grid>

                </Grid>
            </form>
        </Box>
    );
}
